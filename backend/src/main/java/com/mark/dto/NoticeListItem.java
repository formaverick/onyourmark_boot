package com.mark.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class NoticeListItem {
    private Long id;
    private String title;
    private LocalDateTime createdAt;
    private String mainImgUrl;
}
