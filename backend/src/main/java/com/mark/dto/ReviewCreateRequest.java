package com.mark.dto;

import lombok.Data;

import java.util.List;

@Data
public class ReviewCreateRequest {
    private String content;
    private List<ReviewImgRequest> images;
}
