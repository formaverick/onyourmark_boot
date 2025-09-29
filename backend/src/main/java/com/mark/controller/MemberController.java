package com.mark.controller;

import com.mark.dto.LoginRequest;
import com.mark.dto.MemberResponse;
import com.mark.dto.MemberUpdateRequest;
import com.mark.dto.PasswordVerifyRequest;
import com.mark.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
@Log4j2
public class MemberController {
    private final MemberService memberService;

    private String currentUserid() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("인증이 필요합니다.");
        }
        return auth.getName(); // JwtFilter에서 principal로 넣은 userid
    }

    // 비밀번호 확인
    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody PasswordVerifyRequest request) {
        try {
            String userid = SecurityContextHolder.getContext().getAuthentication().getName();
            memberService.verifyPassword(userid, request.getPassword());
            return ResponseEntity.ok().build();
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }


    // 정보 조회
    @GetMapping("/member")
    public ResponseEntity<?> member() {
        try {
            MemberResponse member = memberService.getMember(currentUserid());
            return ResponseEntity.ok(member);
        }catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // 내 정보 수정
    @PutMapping("/update")
    public ResponseEntity<?> update(@RequestBody MemberUpdateRequest request) {
        try {
            memberService.updateMember(currentUserid(), request);
            return ResponseEntity.ok("회원 정보가 수정되었습니다.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
