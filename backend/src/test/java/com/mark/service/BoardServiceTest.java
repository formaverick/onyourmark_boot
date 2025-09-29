package com.mark.service;

import com.mark.constant.Role;
import com.mark.constant.WriterType;
import com.mark.dto.BoardPostCreateRequest;
import com.mark.entity.BoardPost;
import com.mark.entity.User;
import com.mark.repository.BoardRepository;
import com.mark.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@SpringBootTest
@Transactional
class BoardServiceTest {

    @Autowired
    BoardService boardService;
    @Autowired
    BoardRepository boardRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    PasswordEncoder passwordEncoder;

    private User savedUser;
    private final String loginUserid = "tester";

/*    @BeforeEach
    void setUp() {
        String randomPhone = "010" + (int)(Math.random() * 100000000);
        savedUser = userRepository.save(User.builder()
                .userid(loginUserid + System.currentTimeMillis())
                .username("테스트")
                .password(passwordEncoder.encode("0611"))
                .email("tester" + System.currentTimeMillis() + "@test.com")
                .phone(randomPhone)
                .role(Role.MEMBER)
                .build());
    }

    @Test
    @DisplayName("회원 글 작성")
    void createBoardPost() {
        BoardPostCreateRequest request = new BoardPostCreateRequest();
        request.setTitle("test");
        request.setContent("test content");
        request.setSecret(false);
        request.setPostPassword("1234");

        Long postId = boardService.create(request, loginUserid);

        BoardPost found =  boardRepository.findById(postId).orElseThrow();

        assertThat(found.getWriterType()).isEqualTo(WriterType.MEMBER);
        assertThat(found.getMember()).isNotNull();
        assertThat(found.getMember().getUserid()).isEqualTo(savedUser.getUserid());
        assertThat(found.getMember().getUserid()).isEqualTo(loginUserid);
        assertThat(found.getWriterName()).isNull();

        assertThat(passwordEncoder.matches("1234", found.getPostPassword())).isTrue();

        assertThat(found.getTitle()).isEqualTo("test");
        assertThat(found.getContent()).isEqualTo("test content");
        assertThat(found.isSecret()).isFalse();
        assertThat(found.getCreatedAt()).isNotNull();
        assertThat(found.getUpdatedAt()).isNotNull();
    }

    @Test
    @DisplayName("비회원 글 작성")
    void createGuestPost(){
        BoardPostCreateRequest request = new BoardPostCreateRequest();
        request.setTitle("test");
        request.setContent("test content");
        request.setSecret(true);
        request.setWriterName("홍길동");
        request.setPostPassword("1234");

        String loginUserid = null;

        Long postId = boardService.create(request, loginUserid);

        BoardPost found = boardRepository.findById(postId).orElseThrow();
        assertThat(found.getWriterType()).isEqualTo(WriterType.GUEST);
        assertThat(found.getMember()).isNull();
        assertThat(found.getWriterName()).isEqualTo("홍길동");
        assertThat(passwordEncoder.matches("1234", found.getPostPassword())).isTrue();
        assertThat(found.isSecret()).isTrue();
    }

    @Test
    @DisplayName("더미데이터 30개 삽입")
    @Rollback(false)
    void insertDummyPosts() {
        User member2 = userRepository.save(User.builder()
                .userid("test3")
                .username("tester3")
                .password(passwordEncoder.encode("0615"))
                .email("member3@test.com")
                .phone("01020250923")
                .role(Role.MEMBER)
                .build());

        for (int i = 1; i <= 20; i++) {
            boardRepository.save(BoardPost.builder()
                    .title("문의 합니다. " + i)
                    .content("게스트 문의 내용 " + i)
                    .writerType(WriterType.GUEST)
                    .writerName("사용자" + i)
                    .postPassword(passwordEncoder.encode("guestpw"))
                    .isSecret(i % 5 == 0)
                    .build());
        }

        for (int i = 1; i <= 10; i++) {
            User author = (i % 2 == 0) ? savedUser : member2;
            boardRepository.save(BoardPost.builder()
                    .title("재입고 문의 " + i)
                    .content("회원 더미 문의 내용 " + i)
                    .writerType(WriterType.MEMBER)
                    .member(author)
                    .postPassword(passwordEncoder.encode("memberpw"))
                    .isSecret(i % 3 == 0)
                    .build());
        }
    }*/


}