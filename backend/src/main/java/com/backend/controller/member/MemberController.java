package com.backend.controller.member;

import com.backend.domain.member.Member;
import com.backend.service.member.MemberService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Update;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
        Map<String, Object> member = memberService.getByUsername(username);
        if (member == null) {
            return ResponseEntity.ok(username);
        }
        return ResponseEntity.notFound().build();
    }

    // 닉네임 체크
    @GetMapping(value = "check", params = "nickname")
    public ResponseEntity checkNickname(@RequestParam("nickname") String nickname, Authentication authentication) {
        Member member = memberService.getByNickname(nickname);
        if (member == null || member.getUsername().equals(authentication.getName())) {
            return ResponseEntity.ok(nickname);
        }
        return ResponseEntity.notFound().build();
    }

    // 프로필 정보 가져오기
    @GetMapping("profile")
    public ResponseEntity profile(Authentication authentication) {
        Map<String, Object> member = memberService.getByUsername(authentication.getName());

        if(member == null) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(member);
        }
    }
    
    // 회원 정보 수정
    @PutMapping("modify")
    public ResponseEntity modify(Member member,
                                 Authentication authentication,
                                 @RequestParam(value="backProfileImage", required = false) MultipartFile profileImage,
                                 HttpServletRequest request,
                                 HttpServletResponse response) throws IOException {
        if(memberService.hasAccessModify(member, authentication)) {
            // 회원 정보 수정
            memberService.modify(member, profileImage);
            // jwt 재발급
            memberService.reissue(member, authentication, request, response);
            return ResponseEntity.status(HttpStatus.OK).build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
    
    // 현재 비밀번호 확인
    @PutMapping("modify-password")
    public ResponseEntity modifyPassword(@RequestBody Member member, Authentication authentication) {
        if(memberService.hasAccessModifyPassword(member, authentication)) {
            memberService.modifyPassword(member);
            return ResponseEntity.ok(member);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    // 회원 탈퇴
    @DeleteMapping("{memberIndex}")
    public ResponseEntity delete(@PathVariable Integer memberIndex) {
        memberService.remove(memberIndex);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
