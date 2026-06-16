package com.example.productservice.domain.ports.externals;

import com.example.productservice.domain.models.external.MediaInfo;

import java.util.List;

public interface MediaService {
    List<MediaInfo> getByIds(List<Long> ids);
}
