package com.mark.service;

import com.mark.dto.MemberResponse;
import com.mark.dto.MemberUpdateRequest;
import com.mark.entity.User;
import com.mark.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberService {
    private final UserRepository userRepository;

    private  final PasswordEncoder passwordEncoder;

    private String normLower(String s){
        return s == null ? null : s.trim().toLowerCase();
    }

    private String norm(String s) { return s == null ? null : s.trim(); }
    private String trim(String s){ return s == null ? null : s.trim(); }

    public void verifyPassword(String userid, String rawPassword) {
        User user = userRepository.findByUserid(userid)
                .orElseThrow(() -> new RuntimeException("사용자가 존재하지 않습니다."));

        if(!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw  new RuntimeException("비밀번호가 틀렸습니다.");
        }

        // ok -> 200 (아무것도 리턴하지 않음)
    }

    public MemberResponse getMember (String userid) {
        User u = userRepository.findByUserid(userid)
                .orElseThrow(() -> new RuntimeException("사용자가 존재하지 않습니다."));

        return new MemberResponse(u.getUserid(), u.getPassword(), u.getUsername(), u.getPhone(), u.getEmail());
    }

    public void updateMember (String userid, MemberUpdateRequest request){
        User u = userRepository.findByUserid(userid)
                .orElseThrow(() -> new RuntimeException("사용자가 존재하지 않습니다."));

        String newEmail = normLower(request.getEmail());

        if(newEmail != null && !newEmail.equals(u.getEmail())){
            if(userRepository.existsByEmail(newEmail))
                throw new RuntimeException("이미 등록된 이메일입니다.");
            u.setEmail(newEmail);
        }

        String newPhone = trim(request.getPhone());
        if(newPhone != null && !newPhone.equals(u.getPhone())){
            if(userRepository.existsByPhone(newPhone))
                throw new RuntimeException("이미 등록된 전화번호입니다.");
            u.setPhone(newPhone);
        }

        userRepository.save(u);
    }
}
