package com.mark.controller;

import com.mark.dto.BoardPostCreateRequest;
import com.mark.dto.BoardPostResponse;
import com.mark.dto.BoardPostUpdateRequest;
import com.mark.service.BoardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.util.StringUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
@Log4j2
public class BoardController {
    private final BoardService boardService;

    // admin 권한 확인
    private boolean hasAdminRole(Authentication authentication) {
        if(authentication == null || authentication.getAuthorities() == null) return false;
        for(GrantedAuthority auth : authentication.getAuthorities()){
            if("ROLE_ADMIN".equals(auth.getAuthority())){
                return true;
            }
        }
        return false;
    }

    private String currentUserid(Authentication authentication) {
        if(authentication == null || !authentication.isAuthenticated()) return null;

        return authentication.getName();
    }

    // 목록 조회
    @GetMapping
    public ResponseEntity<Page<BoardPostResponse>> list(Pageable pageable){
        if (pageable.getPageSize() != 20) {
            pageable = org.springframework.data.domain.PageRequest.of(
                    pageable.getPageNumber(),
                    20,
                    pageable.getSortOr(org.springframework.data.domain.Sort.by(Sort.Direction.DESC, "createdAt"))
            );
        }
        return ResponseEntity.ok(boardService.boardlist(pageable));
    }

    // 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<BoardPostResponse> read(@PathVariable Long id,
                                                  @RequestParam(required = false) String password,
                                                  Authentication authentication){

        boolean isAdmin = hasAdminRole(authentication);
        BoardPostResponse response = boardService.read(id, password, isAdmin);
        return ResponseEntity.ok(response);
    }

    // 작성(등록)
    @PostMapping("/new")
    public ResponseEntity<Long> create(
            @Validated @RequestBody BoardPostCreateRequest request,
            Principal principal // MEMBER 확인
            ){
        String userid = (principal != null && StringUtils.hasText(principal.getName()))
                ? principal.getName() : null;

        Long id = boardService.create(request, userid);

        return ResponseEntity.ok(id);
    }

    // 수정 폼 진입
    @GetMapping("/{id}/edit")
    public ResponseEntity<BoardPostResponse> readForUpdate(
            @PathVariable Long id, @RequestParam(required = false) String password, Authentication authentication
    ){
        String userid = currentUserid(authentication);

        BoardPostResponse response = boardService.readForUpdate(id, userid, password);

        return ResponseEntity.ok(response);
    }

    // 수정
    @PatchMapping("/{id}")
    public ResponseEntity<Long> update(
            @PathVariable Long id,
            @RequestBody BoardPostUpdateRequest request,
            @RequestParam(required = false) String password,
            Authentication authentication){
        String userid = currentUserid(authentication);
        Long updatedId = boardService.update(id, request, userid, password);
        return ResponseEntity.ok(updatedId);
    }

    // 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @RequestParam(required = false) String password,
            Authentication authentication){
        String userid = currentUserid(authentication);
        boardService.delete(id, userid, password);
        return ResponseEntity.noContent().build();
    }

    // 사용자 문의 조회
    @GetMapping("/me")
    public ResponseEntity<Page<BoardPostResponse>> myPosts(
            Authentication authentication,
            Pageable pageable
    ){
        String userid = authentication.getName();
        return ResponseEntity.ok(boardService.myPosts(userid, pageable));
    }
}
