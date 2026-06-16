package com.example.mediaservice.services;

import com.example.mediaservice.dtos.MediaResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IMediaService {
    MediaResponse upload(MultipartFile file) throws IOException;
    MediaResponse getMediaById (Long id) ;
    List<MediaResponse> getByIds (List<Long> ids);
    void deleteById (Long id) throws IOException;
}
