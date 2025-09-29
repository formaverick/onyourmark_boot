package com.mark.service;

import com.mark.entity.Review;
import com.mark.entity.ReviewImg;
import com.mark.repository.ReviewImgRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewImgService {
    @Value("${reviewImgLocation}")              // C:/mj/onyourmark/uploads/review
    private String reviewImgLocation;

    @Value("${app.base-url}")                   // http://localhost:8080
    private String baseUrl;

    private final FileService fileService;
    private final ReviewImgRepository reviewImgRepository;

    public ReviewImg save(Review review, MultipartFile file) throws Exception {
        if(file == null || file.isEmpty()) return null;

        String oriImgName = file.getOriginalFilename();
        String today = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));

        // 물리 저장 경로
        String savePath = reviewImgLocation + "/" + today;
        String saved = fileService.uploadFile(savePath, oriImgName, file.getBytes());

        fileService.uploadFile(savePath, oriImgName, file.getBytes());

        // 접근 URL
        String url = baseUrl + "/img/review/" + today + "/" + saved;

        ReviewImg img = ReviewImg.builder()
                .review(review)
                .imgName(saved)
                .oriImgName(oriImgName)
                .imgUrl(url)
                .build();

        return reviewImgRepository.save(img);
    }

    public void delete(ReviewImg img) throws Exception {
        if(img == null) return;

        String today = img.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
        String phys = reviewImgLocation + "/" + today + "/" + img.getImgName();

        fileService.deleteFile(phys);

        reviewImgRepository.delete(img);
    }
}
