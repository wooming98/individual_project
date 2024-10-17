package com.backend.service.member;

import com.backend.domain.member.Member;
import com.backend.mapper.member.MemberMapper;
import com.backend.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class MemberService {

    private final MemberMapper memberMapper;
    private final BCryptPasswordEncoder passwordEncoder;

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
    public void modify(Member member, Authentication authentication) {
        memberMapper.update(member);
    }
}
