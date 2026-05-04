package com.donatecommerce.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.donatecommerce.entity.Address;

@Repository
public interface AddressRepository extends JpaRepository<Address, UUID> {
    
    List<Address> findByUserIdAndIsDeletedFalseOrderByIsDefaultDescCreatedAtDesc(UUID userId);
    
    Optional<Address> findByIdAndUserIdAndIsDeletedFalse(UUID id, UUID userId);
    
    Optional<Address> findByUserIdAndIsDefaultTrueAndIsDeletedFalse(UUID userId);
    
    @Modifying
    @Transactional
    @Query("UPDATE Address a SET a.isDefault = false WHERE a.user.id = :userId AND a.isDefault = true")
    void removeDefaultAddress(@Param("userId") UUID userId);
    
    @Query("SELECT COUNT(a) FROM Address a WHERE a.user.id = :userId AND a.isDeleted = false")
    long countActiveAddressesByUser(@Param("userId") UUID userId);
}