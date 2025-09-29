package com.mark.repository;

import com.mark.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    @Query(value = "SELECT * FROM review r WHERE r.review_id != :reviewId AND ABS(r.sentiment - :sentiment) <= 1 ORDER BY ABS(r.sentiment - :sentiment) ASC, r.created_at DESC LIMIT 5", nativeQuery = true)
    List<Review> findSimilarReviews(@Param("sentiment") int sentiment, @Param("reviewId") Long reviewId);
}
