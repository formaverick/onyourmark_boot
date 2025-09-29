package com.mark.service;

import com.mark.config.JwtUtil;
import com.mark.constant.Role;
import com.mark.dto.LoginRequest;
import com.mark.dto.SignupRequest;
import com.mark.entity.User;
import com.mark.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    private String lower(String s){ return s == null ? null : s.trim().toLowerCase(); }
    private String trim(String s){ return s == null ? null : s.trim(); }

    // 로그인
    public String login(LoginRequest request) {
        String userid = lower(request.getUserid());

        User user = userRepository.findByUserid(userid)
                .orElseThrow(() -> new RuntimeException("사용자가 존재하지 않습니다."));

        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw  new RuntimeException("비밀번호가 틀렸습니다.");
        }

        return jwtUtil.createToken(user);
    }

    // 회원가입
    public void signup(SignupRequest request) {

        String userid = lower(request.getUserid());
        String email  = lower(request.getEmail());
        String phone  = trim(request.getPhone());

        if (userRepository.existsByUserid(userid))
            throw new RuntimeException("이미 존재하는 아이디입니다.");
        if (userRepository.existsByEmail(email))
            throw new RuntimeException("이미 등록된 이메일입니다.");
        if (userRepository.existsByPhone(phone))
            throw new RuntimeException("이미 등록된 전화번호입니다.");

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User user = new User();

        user.setUserid(userid);
        user.setPassword(encodedPassword);
        user.setUsername(trim(request.getUsername()));
        user.setPhone(phone);
        user.setEmail(email);
        user.setRole(Role.MEMBER);

        userRepository.save(user);
    }
}
