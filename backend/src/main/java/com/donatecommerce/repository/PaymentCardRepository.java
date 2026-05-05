package com.donatecommerce.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.donatecommerce.entity.PaymentCard;

@Repository
public interface PaymentCardRepository extends JpaRepository<PaymentCard, UUID> {
    
    List<PaymentCard> findByUserIdAndIsDeletedFalseOrderByIsDefaultDescCreatedAtDesc(UUID userId);
    
    Optional<PaymentCard> findByIdAndUserIdAndIsDeletedFalse(UUID id, UUID userId);
    
    @Modifying
    @Query("UPDATE PaymentCard p SET p.isDefault = false WHERE p.user.id = :userId")
    void removeDefaultCard(UUID userId);
}
