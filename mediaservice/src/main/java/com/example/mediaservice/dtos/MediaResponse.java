package com.example.mediaservice.dtos;

import com.example.mediaservice.entities.Media;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MediaResponse {
    private Long id ;
    private String url ;
    private String name ;
    private String publicId ;
    private int size ;
    private String contentType ;

    public static MediaResponse from(Media media) {
        MediaResponse mediaResponse = new MediaResponse();
        mediaResponse.setId(media.getId());
        mediaResponse.setUrl(media.getUrl());
        mediaResponse.setName(media.getName());
        mediaResponse.setPublicId(media.getPublicId());
        mediaResponse.setSize(media.getSize() != null ? media.getSize().intValue() : 0);
        mediaResponse.setContentType(media.getContentType());
        return mediaResponse;
    }
}
