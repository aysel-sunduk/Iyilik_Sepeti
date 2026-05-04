package com.donatecommerce.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.donatecommerce.entity.Order;
import com.donatecommerce.entity.OrderStatus;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
    
    List<Order> findByBuyerIdAndIsDeletedFalseOrderByCreatedAtDesc(UUID buyerId);
    
    List<Order> findByBuyerIdAndStatusAndIsDeletedFalseOrderByCreatedAtDesc(UUID buyerId, OrderStatus status);
    
    Optional<Order> findByIdAndIsDeletedFalse(UUID id);
    
    @Query("SELECT o FROM Order o WHERE o.buyer.id = :buyerId AND o.isDeleted = false ORDER BY o.createdAt DESC")
    List<Order> findAllActiveOrdersByBuyer(@Param("buyerId") UUID buyerId);
    
    @Query("SELECT o FROM Order o WHERE o.payment.id = :paymentId")
    Optional<Order> findByPaymentId(@Param("paymentId") UUID paymentId);
}