package com.backend.security;

import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JWTUtil {

    // application.properties 파일에 설정된 것을 기반으로 생성
    private SecretKey secretKey;

    // application.properties 파일에 있는 spring.jwt.secret 값을 주입받아 SecretKey 객체 초기화
    public JWTUtil(@Value("${jwt.secret.key}")String secret) {

        this.secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), Jwts.SIG.HS256.key().build().getAlgorithm());
    }

    // jwt에서 username 추출
    public String getUsername(String token) {

        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("username", String.class);
    }

    // jwt에서 role 추출
    public String getRole(String token) {

        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("role", String.class);
    }

    public Integer getMemberIndex(String token) {

        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("memberIndex", Integer.class);
    }

    public String getCategory(String token) {

        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("category", String.class);
    }

    // jwt가 만료되었는지 여부 확인
    public Boolean isExpired(String token) {

        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().getExpiration().before(new Date());
    }

    // category(access, refresh 인지 구별), username, role, expiredMs을 받아 jwt 생성
    public String createJwt(String category, String username, String role, Integer memberIndex, Long expiredMs) {

        return Jwts.builder()
                .claim("category", category)
                .claim("username", username)
                .claim("role", role)
                .claim("memberIndex", memberIndex)
                .issuedAt(new Date(System.currentTimeMillis())) // 토큰 발행 시간
                .expiration(new Date(System.currentTimeMillis() + expiredMs)) // 토큰 소멸 시간
                .signWith(secretKey)
                .compact();
    }
}
