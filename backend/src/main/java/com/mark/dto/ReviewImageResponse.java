package com.mark.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReviewImageResponse {
    private Long id;
    private String imgUrl;
}
