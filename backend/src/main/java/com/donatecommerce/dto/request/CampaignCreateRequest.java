package com.donatecommerce.dto.request;

import java.math.BigDecimal;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class CampaignCreateRequest {
    
    @Schema(description = "Kampanya başlığı", example = "Hayvanlar İçin Mama Kampanyası")
    private String title;
    
    @Schema(description = "Kampanya açıklaması", example = "Sokak hayvanlarına mama desteği")
    private String description;
    
    @Schema(description = "Resim URL", example = "https://example.com/campaign.jpg")
    private String imageUrl;
    
    @Schema(description = "Hedef tutar", example = "15000.00")
    private BigDecimal targetAmount;
    
    @Schema(description = "Toplanan tutar", example = "0")
    private BigDecimal raisedAmount;
    
    @Schema(description = "Birim", example = "kg")
    private String unit;
    
    @Schema(description = "Hedef sayı", example = "1000")
    private Integer targetCount;
    
    @Schema(description = "Toplanan sayı", example = "0")
    private Integer raisedCount;
    
    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public BigDecimal getTargetAmount() { return targetAmount; }
    public void setTargetAmount(BigDecimal targetAmount) { this.targetAmount = targetAmount; }
    
    public BigDecimal getRaisedAmount() { return raisedAmount; }
    public void setRaisedAmount(BigDecimal raisedAmount) { this.raisedAmount = raisedAmount; }
    
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
    
    public Integer getTargetCount() { return targetCount; }
    public void setTargetCount(Integer targetCount) { this.targetCount = targetCount; }
    
    public Integer getRaisedCount() { return raisedCount; }
    public void setRaisedCount(Integer raisedCount) { this.raisedCount = raisedCount; }
}