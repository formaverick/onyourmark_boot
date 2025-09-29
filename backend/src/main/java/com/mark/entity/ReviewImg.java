package com.mark.entity;

import com.mark.constant.NoticeImgType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "review_img")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewImg {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_img_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false, foreignKey = @ForeignKey(name = "fk_review_img_review"))
    private Review review;

    @Column(name = "img_name", length = 255, nullable = false)
    private String imgName;

    @Column(name = "ori_img_name", length = 255, nullable = false)
    private String oriImgName;

    @Column(name = "img_url", length = 500, nullable = false)
    private String imgUrl;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;
}
