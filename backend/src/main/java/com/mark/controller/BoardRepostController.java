package com.mark.controller;

import com.mark.dto.BoardRepostCreateRequest;
import com.mark.dto.BoardRepostResponse;
import com.mark.dto.BoardRepostUpdateRequest;
import com.mark.service.BoardRepostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.lang.annotation.Repeatable;

@RestController
@RequestMapping("/api/reposts")
@RequiredArgsConstructor
public class BoardRepostController {

    private final BoardRepostService repostService;

    // 조회
    @GetMapping("/{boardId}")
    public ResponseEntity<BoardRepostResponse> read(@PathVariable Long boardId) {
        return repostService.read(boardId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    // 작성 (ADMIN ONLY)
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{boardId}")
    public ResponseEntity<Long> create(
            @PathVariable Long boardId,
            @RequestBody BoardRepostCreateRequest request,
            Authentication authentication
            ){
        String userid = authentication.getName();
        Long id = repostService.create(boardId, request, userid);

        return ResponseEntity.ok(id);
    }

    // 수정 폼
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{boardId}/edit")
    public ResponseEntity<BoardRepostResponse> readForUpdate(@PathVariable Long boardId){
        BoardRepostResponse response = repostService.readForUpdate(boardId);
        return ResponseEntity.ok(response);
    }

    // 수정
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{boardId}")
    public ResponseEntity<Long> update(
            @PathVariable Long boardId,
            @RequestBody BoardRepostUpdateRequest request,
            Authentication authentication
            ){
        String userId = authentication.getName();
        Long id = repostService.update(boardId, request, userId);
        return ResponseEntity.ok(id);
    }

    // 삭제
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{boardId}")
    public ResponseEntity<Void> delete(@PathVariable Long boardId,
                                       Authentication authentication){
        String userid = authentication.getName();
        repostService.delete(boardId, userid);
        return ResponseEntity.noContent().build();
    }
}
