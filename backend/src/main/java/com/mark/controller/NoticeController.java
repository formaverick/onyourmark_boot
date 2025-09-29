package com.mark.controller;

import com.mark.dto.NoticeListItem;
import com.mark.dto.NoticeResponse;
import com.mark.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
public class NoticeController {
    private final NoticeService noticeService;

    // 전체 조회
    @GetMapping
    public ResponseEntity<Page<NoticeListItem>> list(Pageable pageable) {
        if(pageable.getPageSize() != 12) {
            pageable = PageRequest.of(
                    pageable.getPageNumber(), 12,
                    pageable.getSortOr(Sort.by(Sort.Direction.DESC, "createdAt"))
            );
        }
        return ResponseEntity.ok(noticeService.list(pageable));
    }

    // 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<NoticeResponse> detail(@PathVariable Long id) {
        return ResponseEntity.ok(noticeService.getOne(id));
    }

    // 등록 (ADMIN ONLY)
    @PostMapping(consumes = {"multipart/form-data"})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> create(@RequestParam String title,
                                       @RequestParam String content,
                                       @RequestParam("mainImg")MultipartFile mainImg,
                                       @RequestParam(value = "subImgs", required = false) List<MultipartFile> subImgs,
                                       Authentication auth) throws Exception {
        String adminId = (String) auth.getPrincipal();
        Long id = noticeService.create(title, content, mainImg, subImgs, adminId);

        return ResponseEntity.created(URI.create("/api/notices/" + id)).build();
    }

    // 수정 (ADMIN ONLY)
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> update(@PathVariable Long id,
                                       @RequestParam String title,
                                       @RequestParam String content,
                                       @RequestParam(value ="mainImg", required = false)MultipartFile mainImg,
                                       @RequestParam(value = "subImgs", required = false) List<MultipartFile> subImgs) throws Exception {
        noticeService.update(id, title, content, mainImg, subImgs);
        return ResponseEntity.noContent().build();
    }

    // 삭제 (ADMIN ONLY)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) throws Exception{
        noticeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
