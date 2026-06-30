package com.example.productservice.web;

import com.example.productservice.application.dtos.product_review.ProductReviewRequest;
import com.example.productservice.application.dtos.product_review.ProductReviewResponse;
import com.example.productservice.application.services.IProductReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductReviewController {

    private final IProductReviewService productReviewService;

    @GetMapping("/{productId}/reviews")
    public ResponseEntity<Page<ProductReviewResponse>> getProductReviews(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ProductReviewResponse> reviews = productReviewService.findByProductId(productId, PageRequest.of(page, size));
        return ResponseEntity.ok(reviews);
    }

    @PostMapping("/{productId}/reviews")
    public ResponseEntity<ProductReviewResponse> createReview(
            @PathVariable Long productId,
            @RequestBody ProductReviewRequest request) {
        request.setProductId(productId);
        ProductReviewResponse response = productReviewService.save(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) throws Exception {
        productReviewService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
