package com.donatecommerce.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.donatecommerce.dto.FakeStoreProductDTO;
import com.donatecommerce.dto.request.ImportRequest;
import com.donatecommerce.dto.response.ImportResponse;
import com.donatecommerce.entity.Category;
import com.donatecommerce.entity.CategoryType;
import com.donatecommerce.entity.Product;
import com.donatecommerce.repository.CategoryRepository;
import com.donatecommerce.repository.ProductRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductImportService {

    private final RestTemplate restTemplate;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    
    @Value("${import.api.fakestore.url:https://fakestoreapi.com}")
    private String fakeStoreUrl;
    
    @Value("${import.api.dummyjson.url:https://dummyjson.com}")
    private String dummyJsonUrl;

    public ImportResponse importFromFakeStore(ImportRequest request) {
        log.info("Starting import from FakeStore API");
        List<String> importErrors = new ArrayList<>();
        Map<String, Integer> stats = new HashMap<>();
        
        try {
            String url = fakeStoreUrl + "/products";
            FakeStoreProductDTO[] products = restTemplate.getForObject(url, FakeStoreProductDTO[].class);
            
            if (products == null || products.length == 0) {
                return ImportResponse.builder()
                        .success(false)
                        .message("No products found from FakeStore API")
                        .build();
            }
            
            List<String> allowedCategories = request.getCategories();
            int savedCount = 0;
            int skippedCount = 0;
            
            for (FakeStoreProductDTO dto : products) {
                try {
                    if (allowedCategories != null && !allowedCategories.isEmpty()) {
                        if (!allowedCategories.contains(dto.getCategory())) {
                            skippedCount++;
                            continue;
                        }
                    }
                    
                    Category category = getOrCreateCategory(dto.getCategory());
                    
                    if (productRepository.existsByName(dto.getTitle())) {
                        skippedCount++;
                        continue;
                    }
                    
                    Product product = new Product();
                    product.setName(dto.getTitle());
                    product.setDescription(dto.getDescription());
                    product.setPrice(BigDecimal.valueOf(dto.getPrice()));
                    product.setImageUrl(dto.getImage());
                    product.setCategory(category.getName());
                    product.setStockQuantity(100);
                    product.setDonationCount(0);
                    product.setUnit("adet");
                    product.setIsActive(true);
                    product.setIsDeleted(false);
                    product.setCreatedAt(LocalDateTime.now());
                    
                    productRepository.save(product);
                    savedCount++;
                    stats.merge(category.getName(), 1, Integer::sum);
                    
                } catch (Exception e) {
                    log.error("Error saving product: {}", dto.getTitle(), e);
                    importErrors.add("Error saving: " + dto.getTitle() + " - " + e.getMessage());
                }
            }
            
            return ImportResponse.builder()
                    .success(true)
                    .totalFetched(products.length)
                    .totalSaved(savedCount)
                    .totalSkipped(skippedCount)
                    .categoryStats(stats)
                    .errors(importErrors)
                    .message(String.format("Import completed: %d saved, %d skipped", savedCount, skippedCount))
                    .build();
                    
        } catch (Exception e) {
            log.error("Import failed", e);
            return ImportResponse.builder()
                    .success(false)
                    .message("Import failed: " + e.getMessage())
                    .errors(List.of(e.getMessage()))
                    .build();
        }
    }

    public ImportResponse importFromDummyJson(ImportRequest request) {
        log.info("Starting import from DummyJSON API");
        List<String> importErrors = new ArrayList<>();
        Map<String, Integer> stats = new HashMap<>();
        
        try {
            String url = dummyJsonUrl + "/products?limit=100";
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            
            if (response == null || !response.containsKey("products")) {
                return ImportResponse.builder()
                        .success(false)
                        .message("Invalid response from DummyJSON API")
                        .build();
            }

            List<Map<String, Object>> products = (List<Map<String, Object>>) response.get("products");
            
            if (products == null || products.isEmpty()) {
                return ImportResponse.builder()
                        .success(false)
                        .message("No products found from DummyJSON API")
                        .build();
            }
            
            int savedCount = 0;
            int skippedCount = 0;
            
            for (Map<String, Object> dto : products) {
                try {
                    String title = (String) dto.get("title");
                    String category = (String) dto.get("category");
                    Double price = ((Number) dto.get("price")).doubleValue();
                    String thumbnail = (String) dto.get("thumbnail");
                    
                    Category productCategory = getOrCreateCategory(category);
                    
                    if (productRepository.existsByName(title)) {
                        skippedCount++;
                        continue;
                    }
                    
                    Product product = new Product();
                    product.setName(title);
                    product.setDescription((String) dto.get("description"));
                    product.setPrice(BigDecimal.valueOf(price));
                    product.setImageUrl(thumbnail);
                    product.setCategory(productCategory.getName());
                    product.setStockQuantity(100);
                    product.setDonationCount(0);
                    product.setUnit("adet");
                    product.setIsActive(true);
                    product.setIsDeleted(false);
                    product.setCreatedAt(LocalDateTime.now());
                    
                    productRepository.save(product);
                    savedCount++;
                    stats.merge(productCategory.getName(), 1, Integer::sum);
                    
                } catch (Exception e) {
                    log.error("Error saving product", e);
                    importErrors.add("Error saving: " + dto.get("title") + " - " + e.getMessage());
                }
            }
            
            return ImportResponse.builder()
                    .success(true)
                    .totalFetched(products.size())
                    .totalSaved(savedCount)
                    .totalSkipped(skippedCount)
                    .categoryStats(stats)
                    .errors(importErrors)
                    .message(String.format("Import completed: %d saved, %d skipped", savedCount, skippedCount))
                    .build();
            
        } catch (Exception e) {
            log.error("Import failed", e);
            return ImportResponse.builder()
                    .success(false)
                    .message("Import failed: " + e.getMessage())
                    .errors(List.of(e.getMessage()))
                    .build();
        }
    }

    public String[] getCategoriesFromFakeStore() {
        String url = fakeStoreUrl + "/products/categories";
        return restTemplate.getForObject(url, String[].class);
    }

    private Category getOrCreateCategory(String categoryName) {
        String normalizedName = categoryName.toLowerCase().trim();
        
        return categoryRepository.findByNameIgnoreCase(normalizedName)
                .orElseGet(() -> {
                    Category newCategory = new Category();
                    newCategory.setName(normalizedName);
                    newCategory.setDescription("Products in " + normalizedName + " category");
                    newCategory.setType(CategoryType.SHOPPING);
                    newCategory.setIsActive(true);
                    newCategory.setCreatedAt(LocalDateTime.now());
                    
                    String slug = normalizedName
                            .replace(" ", "-")
                            .replace("'", "")
                            .replace("&", "and");
                    newCategory.setNameSlug(slug);
                    
                    return categoryRepository.save(newCategory);
                });
    }
}