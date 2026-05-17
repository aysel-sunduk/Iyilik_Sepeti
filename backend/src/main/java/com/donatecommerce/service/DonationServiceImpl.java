package com.donatecommerce.service;

import com.donatecommerce.dto.response.DonationResponse;
import com.donatecommerce.entity.*;
import com.donatecommerce.repository.DonationRepository;
import com.donatecommerce.repository.OrderItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DonationServiceImpl implements DonationService {

    private final DonationRepository donationRepository;
    private final OrderItemRepository orderItemRepository;

    @Override
    @Transactional(readOnly = true)
    public List<DonationResponse> getMyDonations(String email) {
        return donationRepository.findByDonorEmailOrderByCreatedAtDesc(email)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DonationResponse> getCampaignDonations(UUID campaignId) {
        return donationRepository.findByCampaignId(campaignId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DonationResponse> getAllDonations() {
        return donationRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void createDonationsFromOrder(Order order) {
        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
        
        for (OrderItem item : items) {
            if (Boolean.TRUE.equals(item.getIsDonation())) {
                Donation donation = Donation.builder()
                        .donor(order.getBuyer())
                        .product(item.getProduct())
                        .campaign(item.getProduct().getCampaign())
                        .payment(order.getPayment())
                        .quantity(item.getQuantity())
                        .amount(item.getSubtotal())
                        .status(DonationStatus.PENDING)
                        .notes(order.getNotes())
                        .build();
                
                donationRepository.save(donation);
            }
        }
    }

    @Override
    @Transactional
    public DonationResponse updateDonationProof(UUID donationId, String proofImageUrl, String beneficiary) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Bağış bulunamadı: " + donationId));
        
        if (proofImageUrl != null) {
            donation.setProofImageUrl(proofImageUrl);
        }
        if (beneficiary != null) {
            donation.setBeneficiary(beneficiary);
        }
        
        donation.setStatus(DonationStatus.DELIVERED);
        donation.setDeliveredAt(java.time.LocalDateTime.now());
        
        Donation updatedDonation = donationRepository.save(donation);
        return mapToResponse(updatedDonation);
    }

    @Override
    @Transactional
    public DonationResponse updateDonationStatus(UUID donationId, DonationStatus status) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Bağış bulunamadı: " + donationId));
        
        donation.setStatus(status);
        if (status == DonationStatus.DELIVERED) {
            donation.setDeliveredAt(java.time.LocalDateTime.now());
        }
        
        Donation updatedDonation = donationRepository.save(donation);
        return mapToResponse(updatedDonation);
    }

    private DonationResponse mapToResponse(Donation donation) {
        return DonationResponse.builder()
                .id(donation.getId())
                .donorId(donation.getDonor().getId())
                .donorName(donation.getDonor().getFullName())
                .productId(donation.getProduct() != null ? donation.getProduct().getId() : null)
                .productName(donation.getProduct() != null ? donation.getProduct().getName() : "Genel Bağış")
                .campaignId(donation.getCampaign() != null ? donation.getCampaign().getId() : null)
                .campaignTitle(donation.getCampaign() != null ? donation.getCampaign().getTitle() : null)
                .quantity(donation.getQuantity())
                .amount(donation.getAmount())
                .status(donation.getStatus().name())
                .notes(donation.getNotes())
                .proofImageUrl(donation.getProofImageUrl())
                .beneficiary(donation.getBeneficiary())
                .createdAt(donation.getCreatedAt())
                .deliveredAt(donation.getDeliveredAt())
                .build();
    }
}
