package com.mark.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class BoardPostResponse {
    private Long id;
    private String title;
    private String content;
    private String writerType;
    private String writerName;
    private Long memberId;

    @JsonProperty("isSecret")
    private boolean isSecret;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private int views;
    private boolean hasRepost;
}
