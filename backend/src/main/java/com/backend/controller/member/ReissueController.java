package com.backend.controller.member;

import com.backend.domain.member.RefreshToken;
import com.backend.mapper.member.RefreshMapper;
import com.backend.security.JWTUtil;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Timestamp;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member")
public class ReissueController {

    private final JWTUtil jwtUtil;
    private final RefreshMapper refreshMapper;

    @PostMapping("/reissue")
    public ResponseEntity<?> reissue(HttpServletRequest request, HttpServletResponse response) {

        // request 에서 모든 쿠키를 가져와서 그 쿠키 중 키 값이 refresh 값이 있을경우 가져옴
        String refresh = null;
        Cookie[] cookies = request.getCookies();
        for (Cookie cookie : cookies) {

            if (cookie.getName().equals("refresh")) {

                refresh = cookie.getValue();
            }
        }

        // refresh 값이 null 값인지 확인
        if (refresh == null) {

            // response status code
            return new ResponseEntity<>("refresh token null", HttpStatus.BAD_REQUEST);
        }

        // refresh 토큰 만료시간 체크
        try {
            jwtUtil.isExpired(refresh);
        } catch (ExpiredJwtException e) {

            // response status code
            return new ResponseEntity<>("refresh token expired", HttpStatus.BAD_REQUEST);
        }

        // 토큰이 refresh 인지 확인 (발급시 페이로드에 명시)
        String category = jwtUtil.getCategory(refresh);

        if (!category.equals("refresh")) {

            // response status code
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }

        // DB에 refresh 가 저장되어 있는지
        Boolean isExist = refreshMapper.existsByRefresh(refresh);

        if (!isExist) {

            // response body
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }

        // 토큰에서 값 가져오기
        String username = jwtUtil.getUsername(refresh);
        String role = jwtUtil.getRole(refresh);
        Integer memberIndex = jwtUtil.getMemberIndex(refresh);

        // 가져온 값들로 새로운 access 토큰 생성
        String newAccess = jwtUtil.createJwt("access", username, role, memberIndex,600000L);
        String newRefresh = jwtUtil.createJwt("refresh", username, role, memberIndex, 86400000L);

        // DB에 있는 기존의 refresh 토큰 삭제 후 새 refresh 토큰 저장
        refreshMapper.deleteByRefresh(refresh);
        addRefreshToken(username, refresh, 86400000L);

        // response, 응답 헤더에 새로운 access 값 넣기
        response.setHeader("access", newAccess);
        response.addCookie(createCookie("refresh", newRefresh));

        return new ResponseEntity<>(HttpStatus.OK);
    }

    // 쿠키 생성 메소드
    private Cookie createCookie(String key, String value) {

        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24*60*60);  // 쿠키의 생명주기
        // cookie.setSecure(true);    // https 통신의 경우 이 값을 넣어줌
        // cookie.setPath("/");       // 쿠키가 적용될 범위
        cookie.setHttpOnly(true);    // 클라이언트단에서 자바스크립트로 해당 쿠키를 접근하지 못하도록 함

        return cookie;
    }

    private void addRefreshToken(String username, String refresh, Long expiredMs) {

        // 현재 시간 + 만료 시간으로 Timestamp 생성
        Timestamp expiration = new Timestamp(System.currentTimeMillis() + expiredMs);

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUsername(username);
        refreshToken.setRefresh(refresh);
        refreshToken.setExpiration(expiration);

        refreshMapper.insertByRefresh(refreshToken);
    }
}