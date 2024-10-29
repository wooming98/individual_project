package com.backend.service.member;

import com.backend.domain.member.Member;
import com.backend.domain.member.MemberProfile;
import com.backend.domain.member.RefreshToken;
import com.backend.mapper.member.MemberMapper;
import com.backend.mapper.member.RefreshMapper;
import com.backend.security.CustomLoginFilter;
import com.backend.security.CustomUserDetails;
import com.backend.security.JWTUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.sql.Timestamp;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class MemberService {

    private final MemberMapper memberMapper;
    private final RefreshMapper refreshMapper;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JWTUtil jwtUtil;
    final S3Client s3Client;

    // 버켓 이름
    @Value("${aws.s3.bucket.name}")
    String bucketName;
    // 해당 이미지 URI 앞쪽
    @Value("${image.src.prefix}")
    String srcPrefix;

    // 회원가입 시 입력값이 null, 공백인 경우 잡아내는 메소드
    public boolean signupValidate(Member member) {
        if (member.getUsername() == null || member.getUsername().isBlank()) {
            return false;
        }
        if (member.getPassword() == null || member.getPassword().isBlank()) {
            return false;
        }
        if (member.getNickname() == null || member.getNickname().isBlank()) {
            return false;
        }
        return true;
    }

    // 회원가입
    public void signup(Member member) {
        // 패스워드 암호화
        member.setPassword(passwordEncoder.encode(member.getPassword()));
        memberMapper.signup(member);

        String basicImageUrl = member.getBasicImageUrl();
        System.out.println(basicImageUrl);

        try {
            // 이미지 URL에서 InputStream 가져오기
            InputStream imageStream = new URL(basicImageUrl).openStream();
            // 바이트 배열로 읽기
            byte[] imageBytes = imageStream.readAllBytes();
            // 스트림 닫기
            imageStream.close();

            // 파일을 저장할 위치와 권한을 설정
            String key = String.format("member/%s/basicImage.png", member.getMemberIndex());
            PutObjectRequest putRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .acl(ObjectCannedACL.PUBLIC_READ) // 공개 읽기 권한
                    .build();
            // RequestBody를 바이트 배열로 설정하여 업로드 S3에 객체 업로드
            s3Client.putObject(putRequest, RequestBody.fromBytes(imageBytes));

            // 새로운 이미지 이름 DB에 업데이트
            memberMapper.profileImageNameInsert(member.getMemberIndex(), "basicImage.png");

        } catch (IOException e) {
            // 로그 기록
            System.err.println("이미지 업로드 중 오류 발생: " + e.getMessage());
            throw new RuntimeException("파일 처리 중 오류 발생", e);
        }
    }

    // 닉네임을 가진 멤버가 있는지 확인 메소드
    public Member getByNickname(String nickname) {
        return memberMapper.selectByNickname(nickname.trim());
    }

    // 해당 유저네임으로 멤버가 있는지 확인하는 메소드
    public Member getByUsernameCheck(String username) {
        return memberMapper.selectByUsername(username);
    }

    // 해당 유저네임으로 해당 멤버 정보와 프로필 가져오는 메소드
    public Map<String, Object> getByUsername(String username) {
        Map<String, Object> result = new HashMap<>();
        // username으로 DB에 있는 멤버 정보 가져와서 map에 담기
        Member dbMember = memberMapper.selectByUsername(username.trim());
        result.put("member", dbMember);

        // MemberProfile 객체 만들어서 name과 src 입력 후 map에 담기
        MemberProfile memberProfile = new MemberProfile();
        memberProfile.setName(memberMapper.getProfileImage(dbMember.getMemberIndex()));
        String src = String.format(srcPrefix + "member/%s/%s", dbMember.getMemberIndex(), memberProfile.getName());
        memberProfile.setSrc(src);
        result.put("profile", memberProfile);

        return result;
    }

    // 회원 정보 수정 시 유효성 검사
    public boolean hasAccessModify(Member member, Authentication authentication) {
        if(!authentication.getName().equals(member.getUsername())) {
            System.out.println(authentication.getName());
            System.out.println(member.getUsername());
            return false;
        }

        Member dbMember = memberMapper.selectByUsername(member.getUsername());
        if (dbMember == null) {
            return false;
        }

        return true;
    }

    // 회원 정보 수정
    public void modify(Member member, MultipartFile profileImage) throws IOException {
        if(profileImage != null && !profileImage.isEmpty()) {
            // 파일을 저장할 위치와 권한을 설정
            String key = String.format("member/%s/%s", member.getMemberIndex(), profileImage.getOriginalFilename());
            PutObjectRequest updateRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .acl(ObjectCannedACL.PUBLIC_READ)
                    .build();
            // S3에 객체 업로드
            s3Client.putObject(updateRequest, RequestBody.fromInputStream(profileImage.getInputStream(), profileImage.getSize()));

            // S3에 있던 기존 이미지는 삭제
            String oldProfileImage = memberMapper.getProfileImage(member.getMemberIndex());
            String oldKey = String.format("member/%s/%s", member.getMemberIndex(), oldProfileImage);
            // 파일을 삭제
            DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(oldKey)
                    .build();
            // S3에서 객체 제거
            s3Client.deleteObject(deleteRequest);
            // 새로운 이미지 이름 DB에 업데이트
            memberMapper.profileImageNameUpdate(member.getMemberIndex(), profileImage.getOriginalFilename());
        }
        // 변경사항 업데이트
        memberMapper.update(member);
    }

    // 회원 수정하면서 토큰 재발급 메소드
    public void reissue(Member member, Authentication authentication, HttpServletRequest request, HttpServletResponse response) {
        String refresh = null;
        // 리퀘스트에서 쿠키 가져오기
        Cookie[] cookies = request.getCookies();
        for (Cookie cookie : cookies) {
            if (cookie.getName().equals("refresh")) {
                refresh = cookie.getValue();
            }
        }

        // 토큰생성을 위한 값 가져오기
        String username = authentication.getName();
        Integer memberIndex = member.getMemberIndex();
        String nickname = member.getNickname();
        // role 값 가져오기
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        // 가져온 값들로 새로운 토큰 생성
        String reAccess = jwtUtil.createJwt("access", username, role, memberIndex, nickname, 600000L);
        String reRefresh = jwtUtil.createJwt("refresh", username, role, memberIndex, nickname, 86400000L);

        // DB에 있는 기존의 refresh 토큰 삭제 후 새 refresh 토큰 저장
        refreshMapper.deleteByRefresh(refresh);
        addRefreshToken(username, reRefresh, 86400000L);

        // response, 응답 헤더에 새로운 토큰 값 넣기
        response.setHeader("access", reAccess);
        response.addCookie(createCookie("refresh", reRefresh));
    }

    // 쿠키 생성 메소드
    private Cookie createCookie(String key, String value) {

        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24*60*60);  // 쿠키의 생명주기
        // cookie.setSecure(true);    // https 통신의 경우 이 값을 넣어줌
        cookie.setPath("/");       // 쿠키가 적용될 범위
        cookie.setHttpOnly(true);    // 클라이언트단에서 자바스크립트로 해당 쿠키를 접근하지 못하도록 함

        return cookie;
    }

    // DB에 넣을 리프레쉬 값 생성
    private void addRefreshToken(String username, String refresh, Long expiredMs) {

        // 현재 시간 + 만료 시간으로 Timestamp 생성
        Timestamp expiration = new Timestamp(System.currentTimeMillis() + expiredMs);

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUsername(username);
        refreshToken.setRefresh(refresh);
        refreshToken.setExpiration(expiration);

        refreshMapper.insertByRefresh(refreshToken);
    }

    // 회원 비밀번호 변경 시 유효성 검사
    public boolean hasAccessModifyPassword(Member member, Authentication authentication) {
        if(!authentication.getName().equals(member.getUsername())) {
            return false;
        }

        Member dbMember = memberMapper.selectByUsername(member.getUsername());
        if (dbMember == null) {
            return false;
        }

        if(!passwordEncoder.matches(member.getOldPassword(), dbMember.getPassword())) {
            return false;
        }

        if(member.getPassword().isEmpty()) {
            return false;
        }

        return true;
    }

    // 회원 비밀번호 변경
    public void modifyPassword(Member member) {
        member.setPassword(passwordEncoder.encode(member.getPassword()));
        memberMapper.updatePassword(member);
    }

    // 회원 탈퇴
    public void remove(Integer memberIndex) {
        memberMapper.deleteByMemberIndex(memberIndex);
    }
}
