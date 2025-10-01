package com.mark.service;

import com.mark.dto.ReviewListItem;
import com.mark.dto.ReviewResponse;
import com.mark.dto.ReviewUserResponse;
import com.mark.entity.Review;
import com.mark.entity.ReviewImg;
import com.mark.entity.User;
import com.mark.repository.ReviewImgRepository;
import com.mark.repository.ReviewRepository;
import com.mark.repository.UserRepository;
import jakarta.persistence.EntityExistsException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewImgRepository reviewImgRepository;
    private final UserRepository userRepository;
    private final ReviewImgService reviewImgService;
    private final RestTemplate restTemplate;

    @Value("${flask.api.url}")
    private String flaskApiUrl;

    // 리뷰 리스트
    @Transactional(readOnly = true)
    public Page<ReviewListItem> getAllReviews(Pageable pageable) {
        Page<Review> page = reviewRepository.findAll(pageable);
        return new PageImpl<>(mapReviewsToDto(page.getContent()), pageable, page.getTotalElements());
    }

    // 리뷰 상세조회
    @Transactional(readOnly = true)
    public ReviewResponse getOne(Long id){
        Review review = reviewRepository.findById(id).orElseThrow(EntityExistsException::new);

        List<String> imgs = reviewImgRepository.findByReviewIdOrderByIdAsc(review.getId())
                .stream().map(ReviewImg::getImgUrl).toList();

        ReviewUserResponse memberSum = ReviewUserResponse.from(review.getMember());

        List<ReviewListItem> relatedReviews = getSimilarReviews(review.getSentiment(), review.getId());

        return ReviewResponse.builder()
                .id(review.getId())
                .content(review.getContent())
                .sentiment(review.getSentiment())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .images(imgs)
                .member(memberSum)
                .relatedReviews(relatedReviews)
                .build();
    }

    // 유사 리뷰 조회
    private List<ReviewListItem> getSimilarReviews(int sentiment, Long reviewId) {
        List<Review> similarReviews = reviewRepository.findSimilarReviews(sentiment, reviewId);
        return mapReviewsToDto(similarReviews);
    }

    // 리뷰 작성
    @Transactional
    public ReviewResponse create(String content, List<MultipartFile> imgs, String memberId) throws Exception {
        // Flask API 호출 (Bean으로 관리되는 RestTemplate 사용)
        int sentiment = analyzeSentiment(content);

        // 회원 조회
        User member = userRepository.findByUserid(memberId)
                .orElseThrow(() -> new RuntimeException("사용자가 존재하지 않습니다."));

        Review review = Review.builder()
                .content(content)
                .sentiment(sentiment)
                .member(member)
                .build();
        reviewRepository.save(review);

        // 이미지 저장
        if(imgs != null) {
            for(MultipartFile file : imgs){
                if(file != null && !file.isEmpty()) {
                    reviewImgService.save(review, file);
                }
            }
        }

        List<String> imgUrl= reviewImgRepository.findByReviewIdOrderByIdAsc(review.getId())
                .stream().map(ReviewImg::getImgUrl).toList();

        return ReviewResponse.builder()
                .id(review.getId())
                .content(review.getContent())
                .sentiment(review.getSentiment())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .images(imgUrl)
                .member(ReviewUserResponse.from(member))
                .relatedReviews(getSimilarReviews(review.getSentiment(), review.getId()))
                .build();
    }

    // 감성 분석 API 호출 로직
    private int analyzeSentiment(String content) {
        try {
            Map<String, String> request = Map.of("content", content);
            Map<String, Object> response = restTemplate.postForObject(flaskApiUrl, request, Map.class);

            if (response == null || !Objects.equals(response.get("status"), "success")) {
                throw new RuntimeException("Flask 감성분석에 실패했습니다.");
            }
            return (int) response.get("sentiment");
        } catch (Exception e) {
            log.error("Flask API 호출 실패: {}", e.getMessage());
            // API 호출 실패 시 기본값(예: 3) 또는 예외 처리
            throw new RuntimeException("감성 분석 서비스 호출에 실패했습니다.", e);
        }
    }

    // 중복 로직 DTO 변환 메서드화
    private List<ReviewListItem> mapReviewsToDto(List<Review> reviews) {
        return reviews.stream().map(review -> {
            List<String> imgUrls = reviewImgRepository.findByReviewIdOrderByIdAsc(review.getId())
                    .stream()
                    .map(ReviewImg::getImgUrl)
                    .toList();
            ReviewUserResponse memberSum = ReviewUserResponse.from(review.getMember());
            return new ReviewListItem(
                    review.getId(),
                    review.getContent(),
                    review.getSentiment(),
                    review.getCreatedAt(),
                    imgUrls,
                    memberSum
            );
        }).collect(Collectors.toList());
    }


    public void delete(Long id, String memberId, Authentication auth) throws Exception{
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new EntityExistsException("리뷰가 존재하지 않습니다."));

        User member = userRepository.findByUserid((String) auth.getPrincipal())
                .orElseThrow(() -> new RuntimeException("회원이 존재하지 않습니다."));

        boolean isOwner = review.getMember().getId().equals(member.getId());
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isOwner && !isAdmin) {
            throw new AccessDeniedException("삭제 권한이 없습니다.");
        }

        List<ReviewImg> imgs = reviewImgRepository.findByReviewIdOrderByIdAsc(id);
        for(ReviewImg img : imgs) reviewImgService.delete(img);

        reviewRepository.delete(review);
    }
}
