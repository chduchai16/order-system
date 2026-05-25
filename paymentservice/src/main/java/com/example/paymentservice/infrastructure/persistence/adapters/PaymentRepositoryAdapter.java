package com.example.paymentservice.infrastructure.persistence.adapters;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.example.paymentservice.domain.models.Payment;
import com.example.paymentservice.domain.ports.persistence.PaymentRepository;
import com.example.paymentservice.infrastructure.mappers.PaymentMapper;
import com.example.paymentservice.infrastructure.persistence.entities.PaymentEntity;
import com.example.paymentservice.infrastructure.persistence.jpas.JpaPaymentRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class PaymentRepositoryAdapter implements PaymentRepository {

    private final JpaPaymentRepository jpaPaymentRepository;

    @Override
    public Payment save(Payment payment) {
        PaymentEntity entity = PaymentMapper.toEntity(payment);
        PaymentEntity savedEntity = jpaPaymentRepository.save(entity);
        return PaymentMapper.toDomain(savedEntity);
    }

    @Override
    public Optional<Payment> findById(Long id) {
        return jpaPaymentRepository.findById(id).map(PaymentMapper::toDomain);
    }

    @Override
    public Optional<Payment> findByOrderId(Long orderId) {
        return jpaPaymentRepository.findByOrderId(orderId).map(PaymentMapper::toDomain);
    }

    @Override
    public List<Payment> findAll() {
        return jpaPaymentRepository.findAll().stream()
                .map(PaymentMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Payment> findByCode(String code) {
        return jpaPaymentRepository.findByPaymentCode(code).map(PaymentMapper::toDomain);
    }
}
