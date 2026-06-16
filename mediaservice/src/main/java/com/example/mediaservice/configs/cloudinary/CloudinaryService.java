package com.example.mediaservice.configs.cloudinary;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.mediaservice.dtos.CloudinaryUploadResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService implements ICloudinaryService{
    private final Cloudinary cloudinary ;

    @Override
    public CloudinaryUploadResult upload(MultipartFile file) throws IOException {
        Map<? , ?> result = cloudinary.uploader().upload(
                file.getBytes() ,
                ObjectUtils.emptyMap()
        );
        return CloudinaryUploadResult.builder()
                .publicId((String) result.get("public_id"))
                .url((String) result.get("secure_url"))
                .build();
    }

    @Override
    public void delete(String publicId) throws IOException {
        cloudinary.uploader().destroy(
                publicId ,
                ObjectUtils.emptyMap()
        ) ;
    }
}
