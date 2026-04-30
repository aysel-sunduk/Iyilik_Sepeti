// service/CategoryService.java
package com.donatecommerce.service;

import java.util.List;
import java.util.UUID;

import com.donatecommerce.dto.request.CategoryCreateRequest;
import com.donatecommerce.dto.response.CategoryResponse;
import com.donatecommerce.entity.CategoryType;

public interface CategoryService {
    
    List<CategoryResponse> getAllCategories();
    
    List<CategoryResponse> getActiveCategories();
    
    List<CategoryResponse> getCategoriesByType(CategoryType type);
    
    CategoryResponse getCategoryById(UUID id);
    
    CategoryResponse getCategoryByName(String name);
    
    CategoryResponse createCategory(CategoryCreateRequest request);
    
    CategoryResponse updateCategory(UUID id, CategoryCreateRequest request);
    
    void deleteCategory(UUID id);
}