package com.mark.entity;

import com.mark.constant.WriterType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "board_post")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "board_id")
    private Long id;

    @Column(nullable = false,  length = 200)
    private String title;

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    // GUEST ONLY
    @Column(name = "writer_name", length = 50)
    private String writerName;

    // (MEMBER, GUEST)
    @Enumerated(EnumType.STRING)
    @Column(name = "writer_type", nullable = false)
    private WriterType writerType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", foreignKey = @ForeignKey(name = "fk_board_post_member"))
    private User member;

    // USER, GUEST 공통
    @Column(name = "post_password", nullable = false, length = 255)
    private String postPassword;

    @Column(name = "is_secret", nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
    private boolean isSecret;

    @Column(nullable = false)
    private int views = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false, columnDefinition = "DATETIME ON UPDATE CURRENT_TIMESTAMP")
    private LocalDateTime updatedAt;
}
