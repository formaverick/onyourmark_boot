package com.mark.config;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${uploadPath}")  // file:///C:/mj/onyourmark/uploads/
    private String uploadPath;

    @Value("${noticeImgLocation}") // C:/mj/onyourmark/uploads/notice
    private String noticeImgLocation;

    @Value("${reviewImgLocation}")
    private String reviewImgLocation;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // /img/notice/** 로 들어오는 요청을 실제 로컬 noticeImgLocation 경로와 매핑
        registry.addResourceHandler("/img/notice/**")
                .addResourceLocations("file:///" + noticeImgLocation + "/");

        registry.addResourceHandler("/img/review/**")
                .addResourceLocations("file:///" + reviewImgLocation + "/");
    }
}
