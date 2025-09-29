package com.mark.repository;

import com.mark.entity.BoardPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BoardRepository extends JpaRepository<BoardPost, Long> {
    Page<BoardPost> findByMember_Userid(String userid, Pageable pageable);

    @Query("SELECT b FROM BoardPost b JOIN FETCH b.member ORDER BY b.createdAt DESC")
    List<BoardPost> findAllWithUser();
}
