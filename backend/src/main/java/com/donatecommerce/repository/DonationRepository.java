package com.donatecommerce.repository;

import com.donatecommerce.entity.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DonationRepository extends JpaRepository<Donation, UUID> {
    List<Donation> findByDonorEmailOrderByCreatedAtDesc(String email);
    List<Donation> findByCampaignId(UUID campaignId);
}
