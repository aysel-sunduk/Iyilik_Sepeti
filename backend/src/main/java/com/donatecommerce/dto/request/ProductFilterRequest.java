// dto/request/ProductFilterRequest.java
package com.donatecommerce.dto.request;

import java.math.BigDecimal;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Ürün filtreleme isteği")
public class ProductFilterRequest {
    
    @Schema(description = "Kategori adı", example = "Eğitim")
    private String category;
    
    @Schema(description = "Bağış ürünü mü? (campaign'i olan ürünler)", example = "true")
    private Boolean isDonationProduct;
    
    @Schema(description = "Arama metni", example = "kitap")
    private String search;
    
    @Schema(description = "Minimum fiyat", example = "10")
    private BigDecimal minPrice;
    
    @Schema(description = "Maksimum fiyat", example = "500")
    private BigDecimal maxPrice;
    
    @Schema(description = "Minimum bağış sayısı", example = "100")
    private Integer minDonationCount;
    
    @Schema(description = "Stokta var mı?", example = "true")
    private Boolean inStock;
    
    @Schema(description = "Sayfa numarası", example = "0")
    private Integer page = 0;
    
    @Schema(description = "Sayfa boyutu", example = "10")
    private Integer size = 10;
    
    @Schema(description = "Sıralama alanı", example = "createdAt")
    private String sortBy = "createdAt";
    
    @Schema(description = "Sıralama yönü", example = "DESC", allowableValues = {"ASC", "DESC"})
    private String sortDirection = "DESC";
    
    // Getters and Setters
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public Boolean getIsDonationProduct() { return isDonationProduct; }
    public void setIsDonationProduct(Boolean isDonationProduct) { this.isDonationProduct = isDonationProduct; }
    
    public String getSearch() { return search; }
    public void setSearch(String search) { this.search = search; }
    
    public BigDecimal getMinPrice() { return minPrice; }
    public void setMinPrice(BigDecimal minPrice) { this.minPrice = minPrice; }
    
    public BigDecimal getMaxPrice() { return maxPrice; }
    public void setMaxPrice(BigDecimal maxPrice) { this.maxPrice = maxPrice; }
    
    public Integer getMinDonationCount() { return minDonationCount; }
    public void setMinDonationCount(Integer minDonationCount) { this.minDonationCount = minDonationCount; }
    
    public Boolean getInStock() { return inStock; }
    public void setInStock(Boolean inStock) { this.inStock = inStock; }
    
    public Integer getPage() { return page; }
    public void setPage(Integer page) { this.page = page; }
    
    public Integer getSize() { return size; }
    public void setSize(Integer size) { this.size = size; }
    
    public String getSortBy() { return sortBy; }
    public void setSortBy(String sortBy) { this.sortBy = sortBy; }
    
    public String getSortDirection() { return sortDirection; }
    public void setSortDirection(String sortDirection) { this.sortDirection = sortDirection; }
}