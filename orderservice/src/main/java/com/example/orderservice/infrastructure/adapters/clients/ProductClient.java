package com.example.orderservice.infrastructure.adapters.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name="productservice", url = "${PRODUCT_SERVICE_URL:http://localhost:8082}")
public interface ProductClient {
    @PostMapping("/api/products/{id}/reserve-stock")
    void reserveStock(@PathVariable Long id, @RequestParam Integer quantity);

    @PostMapping("/api/products/{id}/release-stock")
    void releaseStock(@PathVariable Long id, @RequestParam Integer quantity);
}
