package com.example.mediaservice.controllers;

import com.example.mediaservice.dtos.MediaResponse;
import com.example.mediaservice.services.IMediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {

    private final IMediaService mediaService;

    @PostMapping(
            value = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<MediaResponse> upload(
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        return ResponseEntity.ok(mediaService.upload(file));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MediaResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(mediaService.getMediaById(id));
    }

    @GetMapping
    public ResponseEntity<List<MediaResponse>> getByIds(@RequestParam List<Long> ids) {
        return ResponseEntity.ok(mediaService.getByIds(ids));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) throws IOException {
        mediaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
