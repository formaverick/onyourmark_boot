package com.mark.service;

import com.mark.constant.NoticeImgType;
import com.mark.entity.Notice;
import com.mark.entity.NoticeImg;
import com.mark.repository.NoticeImgRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Transactional
public class NoticeImgService {
    @Value("${noticeImgLocation}")
    private String noticeImgLocation;

    @Value("${app.base-url}")
    private String baseUrl;

    private final FileService fileService;
    private final NoticeImgRepository noticeImgRepository;

    public NoticeImg save(Notice notice, MultipartFile file, NoticeImgType type) throws Exception {
        if(file == null || file.isEmpty()) return null;

        String oriIImgName = file.getOriginalFilename();
        String subDir = (type == NoticeImgType.MAIN) ? "main" : "sub";
        String saveDir = noticeImgLocation + "/" + subDir;

        String saved = fileService.uploadFile(saveDir, oriIImgName, file.getBytes());
        String url = baseUrl + "/img/notice/" + subDir + "/" + saved;

        NoticeImg img = NoticeImg.builder()
                .notice(notice)
                .imgName(saved)
                .oriImgName(StringUtils.isEmpty(oriIImgName) ? saved : oriIImgName)
                .imgUrl(url)
                .imgType(type)
                .build();

        return noticeImgRepository.save(img);
    }

    public void delete(NoticeImg img) throws Exception {
        if(img == null) return;

        String phys = noticeImgLocation + "/" +
                (img.getImgType() == NoticeImgType.MAIN ? "main/" : "sub/") +
                img.getImgName();

        fileService.deleteFile(phys);

        noticeImgRepository.delete(img);
    }
}
