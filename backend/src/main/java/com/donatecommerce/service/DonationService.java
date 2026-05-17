package com.donatecommerce.service;

import com.donatecommerce.dto.response.DonationResponse;
import com.donatecommerce.entity.Order;

import java.util.List;
import java.util.UUID;

public interface DonationService {
    List<DonationResponse> getMyDonations(String email);
    List<DonationResponse> getCampaignDonations(UUID campaignId);
    List<DonationResponse> getAllDonations();
    void createDonationsFromOrder(Order order);
    DonationResponse updateDonationProof(UUID donationId, String proofImageUrl, String beneficiary);
    DonationResponse updateDonationStatus(UUID donationId, com.donatecommerce.entity.DonationStatus status);
}
