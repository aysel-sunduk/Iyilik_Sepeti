package com.donatecommerce.service;

import com.donatecommerce.dto.response.DonationResponse;
import com.donatecommerce.entity.*;
import com.donatecommerce.repository.DonationRepository;
import com.donatecommerce.repository.OrderItemRepository;
import com.donatecommerce.repository.OrderRepository;
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
    private final OrderRepository orderRepository;

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
                        .addressText(String.format("%s, %s/%s", 
                                order.getShippingAddress().getAddressLine(), 
                                order.getShippingAddress().getDistrict(), 
                                order.getShippingAddress().getCity()))
                        .latitude(order.getShippingAddress().getLatitude())
                        .longitude(order.getShippingAddress().getLongitude())
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
        UUID orderId = null;
        if (donation.getPayment() != null) {
            Order order = orderRepository.findByPaymentId(donation.getPayment().getId()).orElse(null);
            if (order != null) {
                orderId = order.getId();
                
                // EKSİK VEYA ESKİ KALMIŞ DURUMLARI DİNAMİK SENKRONİZE ET
                boolean needsUpdate = false;
                if (order.getStatus() == com.donatecommerce.entity.OrderStatus.SHIPPED && donation.getStatus() == DonationStatus.PENDING) {
                    donation.setStatus(DonationStatus.SHIPPING);
                    needsUpdate = true;
                } else if (order.getStatus() == com.donatecommerce.entity.OrderStatus.DELIVERED && donation.getStatus() != DonationStatus.DELIVERED) {
                    donation.setStatus(DonationStatus.DELIVERED);
                    donation.setDeliveredAt(order.getDeliveredAt() != null ? order.getDeliveredAt() : java.time.LocalDateTime.now());
                    needsUpdate = true;
                }
                
                if (needsUpdate) {
                    donationRepository.save(donation);
                }
            }
        }

        return DonationResponse.builder()
                .id(donation.getId())
                .orderId(orderId)
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
                .addressText(donation.getAddressText())
                .latitude(donation.getLatitude())
                .longitude(donation.getLongitude())
                .createdAt(donation.getCreatedAt())
                .deliveredAt(donation.getDeliveredAt())
                .build();
    }
}
