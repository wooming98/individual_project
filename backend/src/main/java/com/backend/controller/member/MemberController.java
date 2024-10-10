package com.backend.controller.member;

import com.backend.domain.member.Member;
import com.backend.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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

    // 이메일 체크
    @GetMapping(value = "check", params = "username")
    public ResponseEntity checkUsername(@RequestParam("username") String username) {
        Member member = memberService.getByUsername(username);
        if (member == null) {
            return ResponseEntity.ok(username);
        }
        return ResponseEntity.notFound().build();
    }

    // 닉네임 체크
    @GetMapping(value = "check", params = "nickname")
    public ResponseEntity checkNickname(@RequestParam("nickname") String nickname) {
        Member member = memberService.getByNickname(nickname);
        if (member == null) {
            return ResponseEntity.ok(nickname);
        }
        return ResponseEntity.notFound().build();
    }

    // 프로필
    @GetMapping("profile")
    public ResponseEntity profile(Authentication authentication) {
        System.out.println(authentication.getName());
        return null;
    }

}
