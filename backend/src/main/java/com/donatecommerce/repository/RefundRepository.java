package com.donatecommerce.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.donatecommerce.entity.Refund;
import com.donatecommerce.entity.RefundStatus;

@Repository
public interface RefundRepository extends JpaRepository<Refund, UUID> {
    
    List<Refund> findByPaymentId(UUID paymentId);
    
    List<Refund> findByRequestedById(UUID userId);
    
    List<Refund> findByStatus(RefundStatus status);
    
    boolean existsByPaymentIdAndStatus(UUID paymentId, RefundStatus status);
}