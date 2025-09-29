package com.mark.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class BoardPostUpdateRequest {
    private String title;
    private String content;

    @JsonProperty("isSecret")
    private Boolean isSecret;

    private String postPassword;
}
