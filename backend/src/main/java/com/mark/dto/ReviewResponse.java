package com.mark.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReviewResponse {
    private Long id;
    private String content;
    private int sentiment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<String> images;
    // 작성자 정보
    private ReviewUserResponse member;
    // 관련 리뷰
    private List<ReviewListItem> relatedReviews;
}
