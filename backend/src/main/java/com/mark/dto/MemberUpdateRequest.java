package com.mark.dto;

import lombok.Data;

@Data
public class MemberUpdateRequest {
    private String phone;
    private String email;
}
