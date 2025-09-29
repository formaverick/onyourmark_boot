package com.mark.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardRepostResponse {
    Long id;
    Long boardId;
    Long adminId;
    String content;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
