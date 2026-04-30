// service/ProductService.java
package com.donatecommerce.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;

import com.donatecommerce.dto.request.ProductCreateRequest;
import com.donatecommerce.dto.request.ProductFilterRequest;
import com.donatecommerce.dto.request.ProductUpdateRequest;
import com.donatecommerce.dto.response.ProductResponse;

public interface ProductService {
    
    List<ProductResponse> getAllProducts();
    
    Page<ProductResponse> getProductsWithFilters(ProductFilterRequest filterRequest);
    
    ProductResponse getProductById(UUID id);
    
    List<ProductResponse> getProductsByCategory(String category);
    
    List<ProductResponse> getDonationProducts();
    
    List<ProductResponse> getPopularDonationProducts(int limit);
    
    ProductResponse createProduct(ProductCreateRequest request);
    
    ProductResponse updateProduct(UUID id, ProductUpdateRequest request);
    
    void deleteProduct(UUID id);
}