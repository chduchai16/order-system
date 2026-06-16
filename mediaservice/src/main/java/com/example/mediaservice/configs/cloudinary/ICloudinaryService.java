package com.example.mediaservice.configs.cloudinary;

import com.example.mediaservice.dtos.CloudinaryUploadResult;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ICloudinaryService {
    CloudinaryUploadResult upload(MultipartFile file) throws IOException;
    void delete(String publicId ) throws IOException;
}
