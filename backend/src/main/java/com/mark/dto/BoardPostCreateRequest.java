package com.mark.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Setter
@Getter
public class BoardPostCreateRequest {
    private String title;
    private String content;
    private String writerName;

    @JsonProperty("isSecret")
    private boolean isSecret;

    private String postPassword;
}
