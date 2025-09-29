package com.mark.service;

import com.mark.dto.BoardPostCreateRequest;
import com.mark.dto.BoardPostResponse;
import com.mark.dto.BoardPostUpdateRequest;
import com.mark.entity.BoardPost;
import com.mark.constant.WriterType;
import com.mark.entity.User;
import com.mark.repository.BoardRepository;
import com.mark.repository.BoardRepostRepository;
import com.mark.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional
public class BoardService {
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final BoardRepostRepository boardRepostRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public Page<BoardPostResponse> boardlist(Pageable pageable){
        return boardRepository.findAll(pageable).map(
                p -> toResponse(p).toBuilder()
                        .content(null)
                        .views(p.getViews())
                        .build()
        );
    }

    // 작성
    public Long create(BoardPostCreateRequest request, String userid){
        BoardPost.BoardPostBuilder b = BoardPost.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .postPassword(passwordEncoder.encode(request.getPostPassword()))
                .isSecret(request.isSecret());

        if(userid != null){
            User u = userRepository.findByUserid(userid)
                    .orElseThrow(() -> new RuntimeException("사용자가 존재하지 않습니다."));
            b.writerType(WriterType.MEMBER).member(u).writerName(null);
        }else {
            if(request.getWriterName() == null || request.getWriterName().isBlank()){
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "작성자명을 입력해주세요.");
            }

            b.writerType(WriterType.GUEST).writerName(request.getWriterName()).member(null);
        }

        return boardRepository.save(b.build()).getId();
    }

    // 조회
    @Transactional
    public BoardPostResponse read(Long id, String inputPassword, boolean isAdmin) {
        BoardPost p = boardRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글이 존재하지 않습니다."));

        // 미공개일경우 비밀번호 확인 필요 (관리자 제외)
        if(!isAdmin && p.isSecret()){
            if(inputPassword == null || !passwordEncoder.matches(inputPassword, p.getPostPassword())){
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "비밀번호가 일치하지 않습니다.");
            }
        }

        p.setViews(p.getViews() + 1);

        return toResponse(p);
    }

    // 수정 폼
    @Transactional(readOnly = true)
    public BoardPostResponse readForUpdate(Long id, String userid, String password) {
        BoardPost post = boardRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글이 존재하지 않습니다."));

        // 로그인 유무 확인
        boolean isMemberAuthor = post.getWriterType().isMember()
                && post.getMember() != null && userid != null && post.getMember().getUserid().equals(userid);

        // MEMBER 본인만 가능
        if(post.getWriterType().isMember()){
            if(!isMemberAuthor){
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "작성자 본인만 수정 가능합니다.");
            }
        }else {
            // GUEST 비밀번호 확인 필요
            if(password == null || !passwordEncoder.matches(password, post.getPostPassword())){
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "비밀번호가 일치하지 않습니다.");
            }
        }

        return toResponse(post);
    }

    // 수정
    public Long update(Long id, BoardPostUpdateRequest request, String userid, String inputPassword){
        BoardPost post = boardRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글이 존재하지 않습니다."));

        // 권한 확인
        boolean isMember =
                post.getWriterType().isMember()
                && post.getMember() != null
                && userid != null
                && post.getMember().getUserid().equals(userid);

        // Member
        if(!isMember && post.getWriterType().isMember()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "작성자 본인만 수정 할 수 있습니다.");
        }

        // GUEST, 비공개 글 비밀번호 확인 필수
        if(post.getWriterType() .isGuest()) {
            if(inputPassword == null || !passwordEncoder.matches(inputPassword, post.getPostPassword())){
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "비밀번호가 일치하지 않습니다.");
            }
        }else if (post.isSecret()) {
            if(inputPassword == null || !passwordEncoder.matches(inputPassword, post.getPostPassword())){
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "비밀번호가 일치하지 않습니다.");
            }
        }

        if(request.getTitle() != null) post.setTitle(request.getTitle());
        if(request.getContent() != null) post.setContent(request.getContent());
        if(request.getIsSecret() != null) post.setSecret(request.getIsSecret());
        if(request.getPostPassword() != null) post.setPostPassword(passwordEncoder.encode(request.getPostPassword()));

        return post.getId();
    }

    // 삭제
    public void delete(Long id, String userid, String inputPassword){
        BoardPost post = boardRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글이 존재하지 않습니다."));

        boolean isMember =
                post.getWriterType().isMember()
                        && post.getMember() != null
                        && userid != null
                        && post.getMember().getUserid().equals(userid);

        if(!isMember && post.getWriterType().isMember()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "작성자 본인만 삭제 할 수 있습니다.");
        }

        // 비회원 글의 경우 비밀번호 확인 필수
        if(post.getWriterType().isGuest()){
            if(inputPassword == null || !passwordEncoder.matches(inputPassword, post.getPostPassword())){
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "비밀번호가 일치하지 않습니다.");
            }
        }

        boardRepository.delete(post);
    }

    // 마이페이지 - 회원 문의 내역 조회
    public Page<BoardPostResponse> myPosts(String userid, Pageable pageable){
        return boardRepository.findByMember_Userid(userid, pageable).map(this::toResponse);
    }

    // DTO
    private BoardPostResponse toResponse(BoardPost boardPost) {

        // 작성자 이름 : Member / Guset
        String displayName = (boardPost.getWriterType() == WriterType.MEMBER && boardPost.getMember() != null)
                ? boardPost.getMember().getUsername()
                : boardPost.getWriterName();

        // Member의 경우 : 작성자 id(BoardPost.member_id) -> 그 회원의 PK(User.member_id)
        // Guest의 경우 : null
        Long memberid = boardPost.getMember() == null ? null : boardPost.getMember().getId();

        boolean hasRepost = boardRepostRepository.existsByBoard_Id(boardPost.getId());

        return BoardPostResponse.builder()
                .id(boardPost.getId())
                .title(boardPost.getTitle())
                .content(boardPost.getContent())
                .writerType(boardPost.getWriterType().name())
                .writerName(displayName)
                .memberId(memberid)
                .isSecret(boardPost.isSecret())
                .createdAt(boardPost.getCreatedAt())
                .updatedAt(boardPost.getUpdatedAt())
                .hasRepost(hasRepost)
                .views(boardPost.getViews())
                .build();
    }
}
