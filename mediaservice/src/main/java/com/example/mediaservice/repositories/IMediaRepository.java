package com.example.mediaservice.repositories;

import com.example.mediaservice.entities.Media;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IMediaRepository extends JpaRepository<Media , Long> {
}
