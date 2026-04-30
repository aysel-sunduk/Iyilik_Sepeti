package com.donatecommerce.service;

import java.util.List;
import java.util.UUID;

import com.donatecommerce.dto.request.CampaignCreateRequest;
import com.donatecommerce.dto.response.CampaignResponse;

public interface CampaignService {
    
    List<CampaignResponse> getAllCampaigns();
    
    List<CampaignResponse> getActiveCampaigns();
    
    List<CampaignResponse> getOngoingCampaigns();
    
    CampaignResponse getCampaignById(UUID id);
    
    CampaignResponse createCampaign(CampaignCreateRequest request);
    
    CampaignResponse updateCampaign(UUID id, CampaignCreateRequest request);
    
    void deleteCampaign(UUID id);
}