package com.example.productservice.domain.models.external;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MediaInfo {
    private Long id;
    private String url;
    private String publicId;
    private String name;
    private String contentType;
    private int size;
}
