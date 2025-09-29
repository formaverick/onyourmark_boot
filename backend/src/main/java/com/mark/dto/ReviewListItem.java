package com.mark.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class ReviewListItem {
    private Long id;
    private String content;
    private int sentiment;
    private LocalDateTime createdAt;
    private List<String> images;
    private ReviewUserResponse member;
}
