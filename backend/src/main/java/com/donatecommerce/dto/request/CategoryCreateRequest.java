// dto/request/CategoryCreateRequest.java
package com.donatecommerce.dto.request;

import com.donatecommerce.entity.CategoryType;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Kategori oluşturma isteği")
public class CategoryCreateRequest {
    
    @Schema(description = "Kategori adı", required = true, example = "Eğitim")
    private String name;
    
    @Schema(description = "Kategori slug", example = "egitim")
    private String nameSlug;
    
    @Schema(description = "Açıklama", example = "Eğitim ürünleri")
    private String description;
    
    @Schema(description = "Resim URL", example = "https://example.com/category.jpg")
    private String imageUrl;
    
    @Schema(description = "Kategori tipi", required = true, example = "BOTH")
    private CategoryType type;
    
    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getNameSlug() { return nameSlug; }
    public void setNameSlug(String nameSlug) { this.nameSlug = nameSlug; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public CategoryType getType() { return type; }
    public void setType(CategoryType type) { this.type = type; }
}