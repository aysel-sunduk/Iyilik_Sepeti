package com.donatecommerce.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.donatecommerce.dto.request.CampaignCreateRequest;
import com.donatecommerce.dto.response.CampaignResponse;
import com.donatecommerce.entity.Campaign;
import com.donatecommerce.repository.CampaignRepository;

@Service
public class CampaignServiceImpl implements CampaignService {
    
    @Autowired
    private CampaignRepository campaignRepository;
    
    @Override
    public List<CampaignResponse> getAllCampaigns() {
        return campaignRepository.findAll()
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<CampaignResponse> getActiveCampaigns() {
        return campaignRepository.findByIsActiveTrue()
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<CampaignResponse> getOngoingCampaigns() {
        return campaignRepository.findOngoingCampaigns()
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    @Override
    public CampaignResponse getCampaignById(UUID id) {
        Campaign campaign = campaignRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Kampanya bulunamadı: " + id));
        return convertToResponse(campaign);
    }
    
    @Override
    @Transactional
    public CampaignResponse createCampaign(CampaignCreateRequest request) {
        Campaign campaign = Campaign.builder()
            .title(request.getTitle())
            .description(request.getDescription())
            .imageUrl(request.getImageUrl())
            .targetAmount(request.getTargetAmount())
            .raisedAmount(request.getRaisedAmount() != null ? request.getRaisedAmount() : BigDecimal.ZERO)
            .unit(request.getUnit())
            .targetCount(request.getTargetCount())
            .raisedCount(request.getRaisedCount() != null ? request.getRaisedCount() : 0)
            .isActive(true)
            .createdAt(LocalDateTime.now())
            .build();
        
        Campaign savedCampaign = campaignRepository.save(campaign);
        return convertToResponse(savedCampaign);
    }
    
    @Override
    @Transactional
    public CampaignResponse updateCampaign(UUID id, CampaignCreateRequest request) {
        Campaign campaign = campaignRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Kampanya bulunamadı: " + id));
        
        if (request.getTitle() != null) campaign.setTitle(request.getTitle());
        if (request.getDescription() != null) campaign.setDescription(request.getDescription());
        if (request.getImageUrl() != null) campaign.setImageUrl(request.getImageUrl());
        if (request.getTargetAmount() != null) campaign.setTargetAmount(request.getTargetAmount());
        if (request.getRaisedAmount() != null) campaign.setRaisedAmount(request.getRaisedAmount());
        if (request.getUnit() != null) campaign.setUnit(request.getUnit());
        if (request.getTargetCount() != null) campaign.setTargetCount(request.getTargetCount());
        if (request.getRaisedCount() != null) campaign.setRaisedCount(request.getRaisedCount());
        
        Campaign updatedCampaign = campaignRepository.save(campaign);
        return convertToResponse(updatedCampaign);
    }
    
    @Override
    @Transactional
    public void deleteCampaign(UUID id) {
        Campaign campaign = campaignRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Kampanya bulunamadı: " + id));
        campaign.setActive(false);
        campaignRepository.save(campaign);
    }
    
    private CampaignResponse convertToResponse(Campaign campaign) {
        CampaignResponse response = CampaignResponse.builder()
            .id(campaign.getId())
            .title(campaign.getTitle())
            .description(campaign.getDescription())
            .imageUrl(campaign.getImageUrl())
            .targetAmount(campaign.getTargetAmount())
            .raisedAmount(campaign.getRaisedAmount())
            .unit(campaign.getUnit())
            .targetCount(campaign.getTargetCount())
            .raisedCount(campaign.getRaisedCount())
            .isActive(campaign.isActive())
            .createdAt(campaign.getCreatedAt())
            .build();
        response.calculateProgressPercentage();
        return response;
    }
}