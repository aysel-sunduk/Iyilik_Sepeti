package com.donatecommerce.repository;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.donatecommerce.entity.DonationHub;

@Repository
public interface DonationHubRepository extends JpaRepository<DonationHub, UUID> {
    List<DonationHub> findByIsActiveTrue();
}
