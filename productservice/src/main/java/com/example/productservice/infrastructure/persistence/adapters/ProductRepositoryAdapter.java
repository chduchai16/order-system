package com.example.productservice.infrastructure.persistence.adapters;

import com.example.productservice.domain.models.Product;
import com.example.productservice.domain.ports.persistence.ProductRepository;

import com.example.productservice.infrastructure.mappers.ProductMapper;
import com.example.productservice.infrastructure.persistence.jpas.JpaProductRepository;
import com.example.productservice.infrastructure.persistence.entities.ProductEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ProductRepositoryAdapter implements ProductRepository {

    private final JpaProductRepository jpaProductRepository;

    @Override
    public Product save(Product product) {
        ProductEntity entity = ProductMapper.toEntity(product);
        ProductEntity savedEntity = jpaProductRepository.save(entity);
        return ProductMapper.toDomain(savedEntity);
    }

    @Override
    public Optional<Product> findById(Long id) {
        return jpaProductRepository.findById(id).map(ProductMapper::toDomain);
    }

    @Override
    public List<Product> findAll() {
        return jpaProductRepository.findAll().stream()
                .map(ProductMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Product> findActiveProducts() {
        return jpaProductRepository.findByActiveTrue().stream()
                .map(ProductMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override

    public void deleteById(Long id) {
        jpaProductRepository.deleteById(id);
    }
}
