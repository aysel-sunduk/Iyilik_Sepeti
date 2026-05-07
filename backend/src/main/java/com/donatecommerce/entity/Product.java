package com.donatecommerce.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "products")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue
    private UUID id;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String category;

    private BigDecimal price;

    private String imageUrl;

    private Integer stockQuantity;  // Lombok -> getStockQuantity()
    private Integer donationCount;

    @ManyToOne
    private Campaign campaign;

    private String unit;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;

    private Boolean isActive = true;
    private Boolean isDeleted = false;

    // --- Yeni Özellik Alanları ---

    // Flaş İndirim için
    @Builder.Default
    private Boolean isFlashSale = false;
    private BigDecimal oldPrice;
    private LocalDateTime flashSaleEndDate;

    // Popülerlik için
    @Builder.Default
    private Integer salesCount = 0;
    @Builder.Default
    private Integer viewCount = 0;

    // Konum bazlı arama için (Yakınımda)
    private Double latitude;
    private Double longitude;
    private String city;
    private String district;
    
    // Yeni Sezon için (Manuel kurgu)
    @Builder.Default
    private Boolean isNewSeason = false;
    
    // Manuel getter - OrderService'de getStock() diye çağırdığın için
    public Integer getStock() {
        return stockQuantity;
    }
    
    public void setStock(Integer stock) {
        this.stockQuantity = stock;
    }
}