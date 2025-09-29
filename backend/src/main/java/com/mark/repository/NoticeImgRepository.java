package com.mark.repository;

import com.mark.constant.NoticeImgType;
import com.mark.entity.NoticeImg;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NoticeImgRepository extends JpaRepository<NoticeImg, Long> {
    List<NoticeImg> findByNoticeIdOrderByIdAsc(Long noticeId);

    Optional<NoticeImg> findFirstByNoticeIdAndImgTypeOrderByIdAsc(Long noticeId, NoticeImgType imgType);
}
