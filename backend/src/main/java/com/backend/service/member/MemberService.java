package com.backend.service.member;

import com.backend.domain.member.Member;
import com.backend.domain.member.MemberProfile;
import com.backend.mapper.member.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
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
import java.util.HashMap;
import java.util.Map;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class MemberService {

    private final MemberMapper memberMapper;
    private final BCryptPasswordEncoder passwordEncoder;
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
    }

    // 닉네임을 가진 멤버가 있는지 확인 메소드
    public Member getByNickname(String nickname) {
        return memberMapper.selectByNickname(nickname.trim());
    }

    // 유저네임을 가진 멤버가 있는지 확인 메소드
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
