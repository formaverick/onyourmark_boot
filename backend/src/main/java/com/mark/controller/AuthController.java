package com.mark.controller;

import com.mark.dto.LoginRequest;
import com.mark.dto.SignupRequest;
import com.mark.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    private String normLower(String s){
        return s == null ? null : s.trim().toLowerCase();
    }

    private String norm(String s) { return s == null ? null : s.trim(); }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        request.setUserid(normLower(request.getUserid()));
        String token = authService.login(request);

       return ResponseEntity.ok(Collections.singletonMap("token", token));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request){
        try {
            request.setUserid(normLower(request.getUserid()));
            request.setUsername(norm(request.getUsername()));
            request.setEmail(normLower(request.getEmail()));
            request.setPhone(norm(request.getPhone()));

            authService.signup(request);

            return ResponseEntity.ok("회원가입이 완료되었습니다.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
