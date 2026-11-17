package com.sky.controller.admin;

import com.sky.constant.MessageConstant;
import com.sky.result.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

/**
 * 通用接口（文件上传）
 * 注：当前环境未配置阿里云OSS，采用本地存储，并已在WebMvcConfiguration中
 * 将 /upload/** 映射到本地目录，上传后返回可访问的图片URL。
 */
@RestController
@RequestMapping("/admin/common")
@Slf4j
public class CommonController {

    /** 本地文件存储目录（应用工作目录下的 upload 文件夹） */
    private static final String UPLOAD_DIR = System.getProperty("user.dir") + File.separator + "upload";

    /**
     * 文件上传
     *
     * @param file
     * @return
     */
    @PostMapping("/upload")
    public Result<String> upload(MultipartFile file) {
        log.info("文件上传：{}", file.getOriginalFilename());
        try {
            //原始文件名
            String originalFilename = file.getOriginalFilename();
            //截取原始文件名的后缀
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            //使用UUID构造新文件名称，避免重名
            String objectName = UUID.randomUUID().toString() + extension;

            //确保目录存在
            File dir = new File(UPLOAD_DIR);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            //将文件转存到本地磁盘
            File dest = new File(dir, objectName);
            file.transferTo(dest.getAbsoluteFile());

            //返回可访问的图片URL（通过WebMvcConfiguration配置的静态资源映射访问）
            String url = "http://localhost:8080/upload/" + objectName;
            log.info("文件上传成功，访问地址：{}", url);
            return Result.success(url);
        } catch (IOException e) {
            log.error("文件上传失败：{}", e.getMessage());
        }
        return Result.error(MessageConstant.UPLOAD_FAILED);
    }
}
