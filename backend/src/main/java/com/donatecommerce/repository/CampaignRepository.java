package com.donatecommerce.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.donatecommerce.entity.Campaign;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, UUID> {
    
    List<Campaign> findByIsActiveTrue();
    
    @Query("SELECT c FROM Campaign c WHERE c.isActive = true AND c.raisedAmount < c.targetAmount")
    List<Campaign> findOngoingCampaigns();
}