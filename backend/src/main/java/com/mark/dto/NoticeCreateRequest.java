package com.mark.dto;

import lombok.Data;
import org.apache.logging.log4j.core.config.plugins.validation.constraints.NotBlank;

import java.util.List;

@Data
public class NoticeCreateRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String content;

    private List<NoticeImageRequest> images;
}
