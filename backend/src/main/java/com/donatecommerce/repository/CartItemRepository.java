package com.donatecommerce.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.donatecommerce.entity.CartItem;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, UUID> {
    
    List<CartItem> findByUserId(UUID userId);
    
    Optional<CartItem> findByUserIdAndProductIdAndType(UUID userId, UUID productId, String type);
    
    void deleteByUserId(UUID userId);
    
    void deleteByUserIdAndProductIdAndType(UUID userId, UUID productId, String type);
}
