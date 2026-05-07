// dto/request/ProductCreateRequest.java
package com.donatecommerce.dto.request;

import java.math.BigDecimal;
import java.util.UUID;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Ürün oluşturma isteği")
public class ProductCreateRequest {
    
    @Schema(description = "Ürün adı", requiredMode = Schema.RequiredMode.REQUIRED, example = "Mama Paketi")
    private String name;
    
    @Schema(description = "Ürün açıklaması", requiredMode = Schema.RequiredMode.REQUIRED, example = "Sokak hayvanları için mama")
    private String description;
    
    @Schema(description = "Kategori", requiredMode = Schema.RequiredMode.REQUIRED, example = "Hayvan")
    private String category;
    
    @Schema(description = "Fiyat", requiredMode = Schema.RequiredMode.REQUIRED, example = "150.00")
    private BigDecimal price;
    
    @Schema(description = "Resim URL", example = "https://example.com/image.jpg")
    private String imageUrl;
    
    @Schema(description = "Stok miktarı", example = "100")
    private Integer stockQuantity = 0;
    
    @Schema(description = "Bağış sayısı", example = "0")
    private Integer donationCount = 0;
    
    @Schema(description = "Kampanya ID (bağış ürünü için)", example = "550e8400-e29b-41d4-a716-446655440000")
    private UUID campaignId;
    
    @Schema(description = "Birim", example = "adet")
    private String unit = "adet";
    
    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }
    
    public Integer getDonationCount() { return donationCount; }
    public void setDonationCount(Integer donationCount) { this.donationCount = donationCount; }
    
    public UUID getCampaignId() { return campaignId; }
    public void setCampaignId(UUID campaignId) { this.campaignId = campaignId; }
    
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
}