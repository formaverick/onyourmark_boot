package com.mark.service;

import com.mark.dto.BoardPostCreateRequest;
import com.mark.dto.BoardRepostCreateRequest;
import com.mark.dto.BoardRepostResponse;
import com.mark.dto.BoardRepostUpdateRequest;
import com.mark.entity.BoardPost;
import com.mark.entity.BoardRepost;
import com.mark.entity.User;
import com.mark.repository.BoardRepository;
import com.mark.repository.BoardRepostRepository;
import com.mark.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class BoardRepostService {
    private final BoardRepository boardRepository;
    private final BoardRepostRepository boardRepostRepository;
    private final UserRepository userRepository;

    // 등록 (ADMIN ONLY)
    public Long create(Long boardId, BoardRepostCreateRequest request, String adminId){
        if(request.getContent() == null || request.getContent().isBlank()){
            throw  new ResponseStatusException(HttpStatus.BAD_REQUEST, "답변 내용을 입력하세요.");
        }

        BoardPost post = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "게시물이 존재하지 않습니다."));

        // 관리자 확인
        User admin = userRepository.findByUserid(adminId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자가 존재하지 않습니다."));
        // 권한 확인
        if(!"ADMIN".equals(admin.getRole().name())){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "관리자만 답변 작성이 가능합니다.");
        }

        if(boardRepostRepository.existsByBoard_Id(boardId)){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미 답변이 등록된 게시물입니다.");
        }

        BoardRepost entity = BoardRepost.builder()
                .board(post)
                .admin(admin)
                .content(request.getContent().trim())
                .build();

        return boardRepostRepository.save(entity).getId();
    }

    // 조회
    @Transactional(readOnly = true)
    public Optional<BoardRepostResponse> read(Long boardId){
        return boardRepostRepository.findByBoard_Id(boardId)
                .map(this::toResponse);
    }

    // 수정 폼
    @Transactional(readOnly = true)
    public BoardRepostResponse readForUpdate(Long boardId) {
        BoardRepost repost = boardRepostRepository.findByBoard_Id(boardId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "등록된 답변이 없습니다."));

        return toResponse(repost);
    }

    // 수정 (ADMIN ONLY)
    public Long update(Long boardId, BoardRepostUpdateRequest request, String adminId){
        if(request.getContent() == null || request.getContent().isBlank()){
            throw  new ResponseStatusException(HttpStatus.BAD_REQUEST, "답변 내용을 입력하세요.");
        }

        User admin = userRepository.findByUserid(adminId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자가 존재하지 않습니다."));
        // 권한 확인
        if(!"ADMIN".equals(admin.getRole().name())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "관리자만 수정할 수 있습니다.");
        }

        BoardRepost repost = boardRepostRepository.findByBoard_Id(boardId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "등록된 답변이 없습니다."));

        repost.setContent(request.getContent().trim());

        return repost.getId();
    }

    // 삭제 (ADMIN ONLY)
    public void delete(Long boardId, String adminId){
        User admin = userRepository.findByUserid(adminId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자가 존재하지 않습니다."));
        if(!"ADMIN".equals(admin.getRole().name())){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "관리자만 삭제할 수 있습니다.");
        }

        if(!boardRepostRepository.existsByBoard_Id(boardId)){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "등록된 답변이 없습니다.");
        }

        boardRepostRepository.deleteByBoard_Id(boardId);
    }

    private BoardRepostResponse toResponse(BoardRepost repost) {
        return BoardRepostResponse.builder()
                .id(repost.getId())
                .boardId(repost.getBoard().getId())
                .adminId(repost.getAdmin().getId())
                .content(repost.getContent())
                .createdAt(repost.getCreatedAt())
                .updatedAt(repost.getUpdatedAt())
                .build();
    }

}
