package com.backend.controller.member;

import com.backend.domain.member.Member;
import com.backend.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member")
public class MemberController {

    private final MemberService memberService;

    // 회원가입
    @PostMapping("signup")
    public ResponseEntity signup(@RequestBody Member member) {
        if (memberService.signupValidate(member)) {
            memberService.signup(member);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    // 로그인
    @PostMapping("login")
    public ResponseEntity login(@RequestBody Member member) {

        Map<String, Object> map = memberService.getToken(member);

        if (map == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(map);
    }
}
