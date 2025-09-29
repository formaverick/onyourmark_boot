package com.mark.dto;

import com.mark.constant.NoticeImgType;
import lombok.Data;

@Data
public class NoticeImageRequest {
    private String fileName;
    private NoticeImgType type;
    private String oriImgName;
}
