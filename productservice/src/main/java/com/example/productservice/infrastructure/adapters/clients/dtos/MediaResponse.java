package com.example.productservice.infrastructure.adapters.clients.dtos;

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
}
