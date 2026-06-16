package com.example.productservice.infrastructure.adapters;

import com.example.productservice.domain.ports.externals.MediaService;
import com.example.productservice.domain.models.external.MediaInfo;
import com.example.productservice.infrastructure.adapters.clients.MediaClient;
import com.example.productservice.infrastructure.adapters.clients.dtos.MediaResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MediaServiceAdapter implements MediaService {

    private final MediaClient mediaClient;

    @Override
    public List<MediaInfo> getByIds(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }
        String joinedIds = ids.stream()
                .map(String::valueOf)
                .collect(Collectors.joining(","));
        return mediaClient.getByIds(joinedIds).stream()
                .map(MediaServiceAdapter::toDomain)
                .toList();
    }

    private static MediaInfo toDomain(MediaResponse response) {
        if (response == null) {
            return null;
        }
        return MediaInfo.builder()
                .id(response.getId())
                .url(response.getUrl())
                .publicId(response.getPublicId())
                .name(response.getName())
                .contentType(response.getContentType())
                .size(response.getSize())
                .build();
    }
}
