package com.mark.repository;

import com.mark.entity.BoardPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface BoardRepository extends JpaRepository<BoardPost, Long> {
    Page<BoardPost> findByMember_Userid(String userid, Pageable pageable);

    @Query(value = "SELECT b FROM BoardPost b JOIN FETCH b.member",
           countQuery = "SELECT count(b) FROM BoardPost b")
    Page<BoardPost> findAllWithUser(Pageable pageable);
}
