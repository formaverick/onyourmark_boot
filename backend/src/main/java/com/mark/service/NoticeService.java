package com.mark.service;

import com.mark.constant.NoticeImgType;
import com.mark.dto.NoticeImageResponse;
import com.mark.dto.NoticeListItem;
import com.mark.dto.NoticeResponse;
import com.mark.entity.Notice;
import com.mark.entity.NoticeImg;
import com.mark.entity.User;
import com.mark.repository.NoticeImgRepository;
import com.mark.repository.NoticeRepository;
import com.mark.repository.UserRepository;
import jakarta.persistence.EntityExistsException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class NoticeService {
    private final NoticeRepository noticeRepository;
    private final NoticeImgRepository noticeImgRepository;
    private final UserRepository userRepository;
    private final NoticeImgService noticeImgService;

    // 등록
    public Long create(String title, String content,
                       MultipartFile mainImg, List<MultipartFile> subImgs,
                       String adminId) throws Exception{

        // 관리자 권한 확인
        User admin = userRepository.findByUserid(adminId)
                .orElseThrow(() -> new IllegalArgumentException("권한이 없습니다. : " + adminId));

        // 정보 등록
        Notice notice = Notice.builder()
                .title(title)
                .content(content)
                .adminId(admin)
                .build();
        noticeRepository.save(notice);

        // 필수 메인이미지 확인, 등록
        if(mainImg == null || mainImg.isEmpty())
            throw new IllegalArgumentException("대표이미지는 필수입니다.");

        noticeImgService.save(notice, mainImg, NoticeImgType.MAIN);

        // 상세이미지 확인 후 등록
        if(subImgs != null){
            for(MultipartFile f : subImgs){
                if(f != null && !f.isEmpty()){
                    noticeImgService.save(notice, f, NoticeImgType.SUB);
                }
            }
        }

        return notice.getId();
    }

    // 개별 조회
    @Transactional(readOnly = true)
    public NoticeResponse getOne(Long id) {
        Notice notice = noticeRepository.findById(id).orElseThrow(EntityExistsException::new);
        List<NoticeImg> imgs = noticeImgRepository.findByNoticeIdOrderByIdAsc(notice.getId());
        return toResponse(notice, imgs);
    }

    // 전체 조회
    @Transactional(readOnly = true)
    public Page<NoticeListItem> list(Pageable pageable) {
        Page<Notice> page = noticeRepository.findAll(pageable);

        List<NoticeListItem> items = page.getContent().stream()
                .map(notice -> {
                    NoticeImg mainImg = noticeImgRepository
                            .findFirstByNoticeIdAndImgTypeOrderByIdAsc(notice.getId(), NoticeImgType.MAIN)
                            .orElse(null);
                    return new NoticeListItem(
                            notice.getId(),
                            notice.getTitle(),
                            notice.getCreatedAt(),
                            mainImg != null ? mainImg.getImgUrl() : null
                    );
                }).toList();

        return new PageImpl<>(items, pageable, page.getTotalElements());
    }

    // 수정
    public void update(Long id, String title, String content,
                       MultipartFile mainImg, List<MultipartFile> subImgs) throws Exception {
        Notice notice = noticeRepository.findById(id).orElseThrow(EntityExistsException::new);
        notice.setTitle(title);
        notice.setContent(content);

        // 기존 이미지 조회
        List<NoticeImg> olds = noticeImgRepository.findByNoticeIdOrderByIdAsc(id);

        if (mainImg != null && !mainImg.isEmpty()) {
            // 기존 메인 이미지 삭제
            olds.stream()
                    .filter(img -> img.getImgType() == NoticeImgType.MAIN)
                    .forEach(img -> {
                        try { noticeImgService.delete(img); } catch (Exception e) { e.printStackTrace(); }
                    });
            // 새로 저장
            noticeImgService.save(notice, mainImg, NoticeImgType.MAIN);
        }

        if (subImgs != null && !subImgs.isEmpty()) {
            // 기존 SUB 이미지 모두 삭제
            olds.stream()
                    .filter(img -> img.getImgType() == NoticeImgType.SUB)
                    .forEach(img -> {
                        try { noticeImgService.delete(img); } catch (Exception e) { e.printStackTrace(); }
                    });
            // 새로 저장
            for (MultipartFile f : subImgs) {
                if (f != null && !f.isEmpty()) {
                    noticeImgService.save(notice, f, NoticeImgType.SUB);
                }
            }
        }
    }

    // 삭제
    public void delete(Long id) throws Exception{
        Notice notice = noticeRepository.findById(id).orElseThrow(EntityExistsException::new);
        List<NoticeImg> olds = noticeImgRepository.findByNoticeIdOrderByIdAsc(id);
        for (NoticeImg img : olds) noticeImgService.delete(img);
        noticeRepository.delete(notice);
    }

    // DTO
    private NoticeResponse toResponse(Notice notice, List<NoticeImg> imgs) {
        return NoticeResponse.builder()
                .id(notice.getId())
                .title(notice.getTitle())
                .content(notice.getContent())
                .createdAt(notice.getCreatedAt())
                .updatedAt(notice.getUpdatedAt())
                .adminUserid(notice.getAdminId() != null ? notice.getAdminId().getUserid() : null)
                .images(imgs.stream().map(i -> NoticeImageResponse.builder()
                        .id(i.getId())
                        .imgName(i.getImgName())
                        .oriImgName(i.getOriImgName())
                        .imgUrl(i.getImgUrl())
                        .type(i.getImgType())
                        .build()).toList())
                .build();
    }
}
