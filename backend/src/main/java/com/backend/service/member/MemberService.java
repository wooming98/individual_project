package com.backend.service.member;

import com.backend.domain.member.Member;
import com.backend.mapper.member.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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
    private final JwtEncoder jwtEncoder;

    // 회원가입 시 입력값이 null, 공백인 경우 잡아내는 메소드
    public boolean signupValidate(Member member) {
        if (member.getId() == null || member.getId().isBlank()) {
            return false;
        }
        if (member.getPassword() == null || member.getPassword().isBlank()) {
            return false;
        }
        if (member.getEmail() == null || member.getEmail().isBlank()) {
            return false;
        }
        if (member.getNickName() == null || member.getNickName().isBlank()) {
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

    // 로그인 jwt 발급
    public Map<String, Object> getToken(Member member) {

        Map<String, Object> result = null;

        Member dbMember = memberMapper.selectById(member.getId());

        if (dbMember != null) {
            if (passwordEncoder.matches(member.getPassword(), dbMember.getPassword())) {
                result = new HashMap<>();
                Instant now = Instant.now();

                List<String> authType = memberMapper.selectAuthorityByMemberIndex(dbMember.getMemberIndex());

                // 리스트의 요소가 공백으로 구분된 하나의 문자열로 결합
                String authTypeString = authType.stream()
                        .collect(Collectors.joining(" "));

                JwtClaimsSet claims = JwtClaimsSet.builder()
                        .issuer("self")
                        .issuedAt(now)
                        .expiresAt(now.plusSeconds(60 * 60 * 24 * 7))
                        .subject(dbMember.getMemberIndex().toString())
                        .claim("scope", authTypeString)
                        .claim("id", dbMember.getId())
                        .build();

                String token = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

                result.put("token", token);
            }
        }
        return result;
    }
}
