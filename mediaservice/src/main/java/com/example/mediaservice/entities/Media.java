package com.example.mediaservice.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "medias")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Media {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;

    @Column(nullable = false)
    private String url ;

    @Column(nullable = false , name = "public_id")
    private String publicId ;

    @Column(nullable = false)
    private String name ;

    @Column(nullable = false)
    private Long size ;

    @Column(name = "content_type", nullable = false)
    private String contentType ;

}
