package com.backend.security;

import com.backend.domain.member.RefreshToken;
import com.backend.mapper.member.RefreshMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.sql.Timestamp;
import java.util.Collection;
import java.util.Date;
import java.util.Iterator;

public class CustomLoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;
    private final RefreshMapper refreshMapper;


    public CustomLoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil, RefreshMapper refreshMapper) {

        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.refreshMapper = refreshMapper;

        // 커스텀 로그인 경로 설정
        setFilterProcessesUrl("/api/member/login");
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {

        // 클라이언트 요청에서 username, password 추출
        String username = obtainUsername(request);
        String password = obtainPassword(request);

        // 스프링 시큐리티에서 username과 password를 검증하기 위해서는 token에 담아야 함
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, password, null);

        //token에 담은 검증을 위한 AuthenticationManager로 전달
        return authenticationManager.authenticate(authToken);
    }

    //로그인 성공시 실행하는 메소드 (여기서 JWT를 발급하면 됨)
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) {

        //유저 정보
        String username = authentication.getName();

        CustomUserDetails customUserDetails = (CustomUserDetails)authentication.getPrincipal();
        Integer memberIndex = customUserDetails.getMemberIndex();

        // 반복자를 통해 유저의 role 값 가져오기
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        // 토큰 생성
        String access = jwtUtil.createJwt("access", username, role, memberIndex, 600000L);
        String refresh = jwtUtil.createJwt("refresh", username, role, memberIndex, 86400000L);

        // refresh 토큰 저장
        addRefreshToken(username, refresh, 86400000L);

        //응답 설정
        response.setHeader("access", access);
        response.addCookie(createCookie("refresh", refresh));
        response.setStatus(HttpStatus.OK.value());
    }

    //로그인 실패시 실행하는 메소드
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) {

        response.setStatus(401);
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

    // 쿠키 생성 메소드
    private Cookie createCookie(String key, String value) {

        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24*60*60);  // 쿠키의 생명주기
        // cookie.setSecure(true);    // https 통신의 경우 이 값을 넣어줌
        // cookie.setPath("/");       // 쿠키가 적용될 범위
        cookie.setHttpOnly(true);    // 클라이언트단에서 자바스크립트로 해당 쿠키를 접근하지 못하도록 함

        return cookie;
    }
}
