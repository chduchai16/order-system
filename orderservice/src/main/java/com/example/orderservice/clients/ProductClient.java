package com.example.orderservice.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name="productservice")
public interface ProductClient {
    @PostMapping("/api/products/{id}/deduct-stock")
    ProductResponse deductStock(@PathVariable Long id, @RequestParam Integer quantity);
}
