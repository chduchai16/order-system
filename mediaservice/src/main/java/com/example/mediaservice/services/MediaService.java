package com.example.mediaservice.services;

import com.example.mediaservice.configs.cloudinary.ICloudinaryService;
import com.example.mediaservice.dtos.CloudinaryUploadResult;
import com.example.mediaservice.dtos.MediaResponse;
import com.example.mediaservice.entities.Media;
import com.example.mediaservice.repositories.IMediaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MediaService implements IMediaService {

    private final IMediaRepository mediaRepository ;
    private final ICloudinaryService cloudinaryService ;

    @Override
    public MediaResponse upload(MultipartFile file) throws IOException {
        CloudinaryUploadResult uploadResult = cloudinaryService.upload(file) ;
        Media media = new Media() ;
        media.setUrl(uploadResult.getUrl());
        media.setPublicId(uploadResult.getPublicId());
        media.setName(file.getOriginalFilename());
        media.setSize(file.getSize());
        media.setContentType(file.getContentType());
        return MediaResponse.from(mediaRepository.save(media));
    }

    @Override
    public MediaResponse getMediaById(Long id) {
        return mediaRepository.findById(id)
                .map(MediaResponse::from)
                .orElseThrow(() -> new RuntimeException("Media not found with id: " + id));
    }

    @Override
    public List<MediaResponse> getByIds(List<Long> ids) {
        return mediaRepository.findAllById(ids).stream()
                .map(MediaResponse::from)
                .toList();
    }

    @Override
    public void deleteById(Long id) {
        Media media = mediaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Media not found with id: " + id));
        try {
            cloudinaryService.delete(media.getPublicId());
            mediaRepository.deleteById(id);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete media with id: " + id, e);
        }
    }
}
