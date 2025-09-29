package com.mark.entity;

import com.mark.constant.NoticeImgType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "notice_img")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoticeImg {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notice_img_id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "img_type", length = 10, nullable = false)
    private NoticeImgType imgType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "notice_id", nullable = false, foreignKey = @ForeignKey(name = "fk_notice_img_notice"))
    private Notice notice;

    @Column(name = "img_name", length = 255, nullable = false)
    private String imgName;

    @Column(name = "ori_img_name", length = 255, nullable = false)
    private String oriImgName;

    @Column(name = "img_url", length = 500, nullable = false)
    private String imgUrl;
}
