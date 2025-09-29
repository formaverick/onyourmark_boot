package com.mark.dto;

import lombok.Data;
import org.apache.logging.log4j.core.config.plugins.validation.constraints.NotBlank;
import org.hibernate.annotations.processing.Pattern;

@Data
public class SignupRequest {
    private String userid;

    private String password;

    private String username;

    private String phone;

    private String email;
}
