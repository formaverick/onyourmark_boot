package com.mark.controller;

import com.mark.dto.ReviewListItem;
import com.mark.dto.ReviewResponse;
import com.mark.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    // 리뷰 리스트
    @GetMapping
    private ResponseEntity<Page<ReviewListItem>> list(Pageable pageable){
        if(pageable.getPageSize() != 10) {
            pageable = PageRequest.of(
                    pageable.getPageNumber(), 10,
                    pageable.getSortOr(Sort.by(Sort.Direction.DESC, "createdAt"))
            );
        }
        return ResponseEntity.ok(reviewService.getAllReviews(pageable));
    }

    // 리뷰 상세 조회
    @GetMapping("/{id}")
    private ResponseEntity<ReviewResponse> getReview(@PathVariable Long id){
        return ResponseEntity.ok(reviewService.getOne(id));
    }

    // 리뷰 작성
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<ReviewResponse> create(@RequestParam String content,
                                       @RequestParam(value = "imgs", required = false) List<MultipartFile> imgs,
                                       Authentication auth) throws Exception {
        String memberId = (String) auth.getPrincipal();
        ReviewResponse review = reviewService.create(content, imgs, memberId);

        return ResponseEntity.ok(review);
    }

    // 리뷰 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) throws Exception {
        String memberId = (String) auth.getPrincipal();
        reviewService.delete(id, memberId, auth);
        return ResponseEntity.noContent().build();
    }
}
