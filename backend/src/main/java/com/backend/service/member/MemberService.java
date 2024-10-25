package com.backend.service.member;

import com.backend.domain.member.Member;
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
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class MemberService {

    private final MemberMapper memberMapper;
    private final BCryptPasswordEncoder passwordEncoder;
    final S3Client s3Client;

    @Value("${aws.s3.bucket.name}")
    String bucketName;

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
    public Member getByUsername(String username) {
        return memberMapper.selectByUsername(username.trim());
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

        String key = String.format("member/%s/%s", member.getMemberIndex(), profileImage.getOriginalFilename());
        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .acl(ObjectCannedACL.PUBLIC_READ)
                .build();

        s3Client.putObject(objectRequest, RequestBody.fromInputStream(profileImage.getInputStream(), profileImage.getSize()));

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
