package com.mark.service;

import com.mark.dto.LoginRequest;
import com.mark.dto.SignupRequest;
import com.mark.entity.User;
import com.mark.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

 /*   @Test
    @DisplayName("로그인 테스트")
    void loginTest() {

        User user = new User();

        user.setUserid("jooyeani");
        user.setPassword(passwordEncoder.encode("0912"));
        user.setUsername("이주연");
        user.setPhone("01020020912");
        user.setEmail("test@gmail.com");
        userRepository.save(user);

        LoginRequest request = new LoginRequest();
        request.setUserid("jooyeani");
        request.setPassword("0912");

        String result = authService.login(request);

        assertEquals("로그인 성공", result);
    }*/
}