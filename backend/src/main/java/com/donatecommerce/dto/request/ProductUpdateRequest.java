// dto/request/ProductUpdateRequest.java
package com.donatecommerce.dto.request;

import java.math.BigDecimal;
import java.util.UUID;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Ürün güncelleme isteği")
public class ProductUpdateRequest {
    
    @Schema(description = "Ürün adı", example = "Mama Paketi")
    private String name;
    
    @Schema(description = "Ürün açıklaması", example = "Sokak hayvanları için mama")
    private String description;
    
    @Schema(description = "Kategori", example = "Hayvan")
    private String category;
    
    @Schema(description = "Fiyat", example = "150.00")
    private BigDecimal price;
    
    @Schema(description = "Resim URL", example = "https://example.com/image.jpg")
    private String imageUrl;
    
    @Schema(description = "Stok miktarı", example = "100")
    private Integer stockQuantity;
    
    @Schema(description = "Kampanya ID", example = "550e8400-e29b-41d4-a716-446655440000")
    private UUID campaignId;
    
    @Schema(description = "Birim", example = "adet")
    private String unit;
    
    @Schema(description = "Aktif mi?", example = "true")
    private Boolean isActive;
    
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
    
    public UUID getCampaignId() { return campaignId; }
    public void setCampaignId(UUID campaignId) { this.campaignId = campaignId; }
    
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}