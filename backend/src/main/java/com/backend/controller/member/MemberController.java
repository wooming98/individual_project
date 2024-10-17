package com.backend.controller.member;

import com.backend.domain.member.Member;
import com.backend.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.annotations.Update;
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

    // 프로필 정보 가져오기
    @GetMapping("profile")
    public ResponseEntity profile(Authentication authentication) {
        Member member = memberService.getByUsername(authentication.getName());

        if(member == null) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(member);
        }
    }
    
    // 회원 정보 수정
    @PutMapping("modify")
    public ResponseEntity modify(@RequestBody Member member, Authentication authentication) {
        if(memberService.hasAccessModify(member, authentication)) {
            memberService.modify(member, authentication);
            return ResponseEntity.ok(member);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}
