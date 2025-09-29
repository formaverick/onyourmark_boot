package com.mark.service;

import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

@Service
@Log4j2
public class FileService {
    public String uploadFile(String uploadPath, String originalFileName, byte[] fileData)
        throws Exception {

        Path dir = Paths.get(uploadPath).toAbsolutePath().normalize();
        Files.createDirectories(dir);

        String safeName = Objects.toString(originalFileName, "");
        String ext = "";
        int dot = safeName.lastIndexOf('.');
        if (dot > -1 && dot < safeName.length() - 1) {
            ext = safeName.substring(dot).toLowerCase(); // ".jpg"
        }

        String saved = UUID.randomUUID() + ext;
        Path target = dir.resolve(saved).normalize();

        try (InputStream in = new java.io.ByteArrayInputStream(fileData)) {
            Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
        }

        log.info("파일 저장: {} -> {}", originalFileName, target);
        return saved;
    }

    public void deleteFile(String filePath) throws Exception {
        File deleteFile = new File(filePath);

        if(deleteFile.exists() && deleteFile.delete()) log.info("삭제 파일 : ", filePath);
    }
}
