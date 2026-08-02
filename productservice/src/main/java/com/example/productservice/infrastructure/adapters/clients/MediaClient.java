package com.example.productservice.infrastructure.adapters.clients;

import com.example.commonlib.response.ApiResponse;
import com.example.productservice.infrastructure.adapters.clients.dtos.MediaResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "mediaservice", url = "${MEDIA_SERVICE_URL:http://localhost:8086}")
public interface MediaClient {

    @GetMapping("/api/media")
    ApiResponse<List<MediaResponse>> getByIds(@RequestParam("ids") String ids) ;

}
