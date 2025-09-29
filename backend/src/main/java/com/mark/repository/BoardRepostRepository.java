package com.mark.repository;

import com.mark.entity.BoardPost;
import com.mark.entity.BoardRepost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BoardRepostRepository extends JpaRepository<BoardRepost, Long> {
    Optional<BoardRepost> findByBoard_Id(Long boardId);
    boolean existsByBoard_Id(Long boardId);
    void deleteByBoard_Id(Long boardId);
}
