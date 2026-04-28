package com.donatecommerce.controller;

import com.donatecommerce.dto.response.ApiResponse;
import com.donatecommerce.entity.Campaign;
import com.donatecommerce.repository.CampaignRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/campaigns")
@RequiredArgsConstructor
@Tag(name = "Campaigns", description = "Bağış Kampanyaları İşlemleri")
public class CampaignController {

    private final CampaignRepository campaignRepository;

    @GetMapping
    @Operation(summary = "Aktif bağış kampanyalarını getir")
    public ResponseEntity<ApiResponse<List<Campaign>>> getActiveCampaigns() {
        List<Campaign> campaigns = campaignRepository.findAllByIsActiveTrue();
        return ResponseEntity.ok(ApiResponse.success(campaigns, "Kampanyalar başarıyla getirildi"));
    }
}
