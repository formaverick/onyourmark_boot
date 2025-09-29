package com.mark.dto;

import com.mark.constant.Role;
import com.mark.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReviewUserResponse {
    private Long memberId;
    private String username;
    private Role role;

    public static ReviewUserResponse from(User user) {
        return new ReviewUserResponse(user.getId(), user.getUsername(), user.getRole());
    }
}
