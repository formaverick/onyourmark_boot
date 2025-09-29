package com.mark.dto;

import com.mark.constant.NoticeImgType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NoticeImageResponse {
    private Long id;
    private String imgName;
    private String oriImgName;
    private String imgUrl;
    private NoticeImgType type;
}
