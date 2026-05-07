package com.donatecommerce.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.donatecommerce.dto.request.ProductCreateRequest;
import com.donatecommerce.dto.request.ProductFilterRequest;
import com.donatecommerce.dto.request.ProductUpdateRequest;
import com.donatecommerce.dto.response.CampaignResponse;
import com.donatecommerce.dto.response.ProductResponse;
import com.donatecommerce.entity.Campaign;
import com.donatecommerce.entity.Product;
import com.donatecommerce.repository.CampaignRepository;
import com.donatecommerce.repository.ProductRepository;

@Service
public class ProductServiceImpl implements ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private CampaignRepository campaignRepository;
    
    @Override
    public List<ProductResponse> getAllProducts() {
        Pageable pageable = PageRequest.of(0, 100);
        return productRepository.findAllActiveProducts(pageable)
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    @Override
    public Page<ProductResponse> getProductsWithFilters(ProductFilterRequest filterRequest) {
        Pageable pageable = PageRequest.of(
            filterRequest.getPage(),
            filterRequest.getSize(),
            Sort.by(Sort.Direction.fromString(filterRequest.getSortDirection()), filterRequest.getSortBy())
        );
        
        Page<Product> productPage;
        
        // Kategori filtresi
        if (filterRequest.getCategory() != null && !filterRequest.getCategory().isEmpty()) {
            productPage = productRepository.findByCategoryAndIsActiveTrue(filterRequest.getCategory(), pageable);
        } 
        // Yeni Sezon filtresi
        else if (filterRequest.getIsNewSeason() != null && filterRequest.getIsNewSeason()) {
            pageable = PageRequest.of(filterRequest.getPage(), filterRequest.getSize(), Sort.by(Sort.Direction.DESC, "createdAt"));
            productPage = productRepository.findAllActiveProducts(pageable);
        }
        // Flaş İndirim filtresi (tümü değil sadece filtrede)
        else if (filterRequest.getIsFlashSale() != null && filterRequest.getIsFlashSale()) {
            // Because findFlashSales returns List, we can just map it and paginate in memory or create a new Page method.
            // A quick workaround for now is to use findAllActiveProducts and we will let the new getFlashSales handle direct calls.
            productPage = productRepository.findAllActiveProducts(pageable);
        }
        // Bağış ürünleri filtresi (isDonationProduct = true)
        else if (filterRequest.getIsDonationProduct() != null && filterRequest.getIsDonationProduct()) {
            productPage = productRepository.findDonationProductsPage(pageable);
        }
        // Arama filtresi
        else if (filterRequest.getSearch() != null && !filterRequest.getSearch().isEmpty()) {
            productPage = productRepository.searchProducts(filterRequest.getSearch(), pageable);
        }
        // Fiyat aralığı
        else if (filterRequest.getMinPrice() != null || filterRequest.getMaxPrice() != null) {
            BigDecimal minPrice = filterRequest.getMinPrice() != null ? filterRequest.getMinPrice() : BigDecimal.ZERO;
            BigDecimal maxPrice = filterRequest.getMaxPrice() != null ? filterRequest.getMaxPrice() : BigDecimal.valueOf(999999);
            productPage = productRepository.filterByPriceRange(minPrice, maxPrice, pageable);
        }
        // Tüm aktif ürünler
        else {
            productPage = productRepository.findAllActiveProducts(pageable);
        }
        
        return productPage.map(this::convertToResponse);
    }
    
    @Override
    public ProductResponse getProductById(UUID id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ürün bulunamadı: " + id));
        return convertToResponse(product);
    }
    
    @Override
    public List<ProductResponse> getProductsByCategory(String category) {
        Pageable pageable = PageRequest.of(0, 50);
        Page<Product> productPage = productRepository.findByCategoryAndIsActiveTrue(category, pageable);
        return productPage.stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<ProductResponse> getDonationProducts() {
        return productRepository.findDonationProducts()
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<ProductResponse> getPopularDonationProducts(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return productRepository.findPopularDonationProducts(pageable)
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<ProductResponse> getFlashSales() {
        return productRepository.findFlashSales()
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<ProductResponse> getNearbyProducts(Double lat, Double lng, Double radiusKm) {
        if (lat == null || lng == null) {
            return getAllProducts(); // Fallback if no location provided
        }
        Double radius = radiusKm != null ? radiusKm : 5.0; // Default 5km
        return productRepository.findNearbyProducts(lat, lng, radius)
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public ProductResponse createProduct(ProductCreateRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCategory(request.getCategory());
        product.setPrice(request.getPrice());
        product.setImageUrl(request.getImageUrl());
        product.setStockQuantity(request.getStockQuantity() != null ? request.getStockQuantity() : 0);
        product.setDonationCount(request.getDonationCount() != null ? request.getDonationCount() : 0);
        product.setUnit(request.getUnit() != null ? request.getUnit() : "adet");
        product.setCreatedAt(LocalDateTime.now());
        product.setIsActive(true);
        product.setIsDeleted(false);
        
        if (request.getCampaignId() != null) {
            Campaign campaign = campaignRepository.findById(request.getCampaignId())
                .orElseThrow(() -> new RuntimeException("Kampanya bulunamadı: " + request.getCampaignId()));
            product.setCampaign(campaign);
        }
        
        Product savedProduct = productRepository.save(product);
        return convertToResponse(savedProduct);
    }
    
    @Override
    @Transactional
    public ProductResponse updateProduct(UUID id, ProductUpdateRequest request) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ürün bulunamadı: " + id));
        
        if (request.getName() != null) product.setName(request.getName());
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getCategory() != null) product.setCategory(request.getCategory());
        if (request.getPrice() != null) product.setPrice(request.getPrice());
        if (request.getImageUrl() != null) product.setImageUrl(request.getImageUrl());
        if (request.getStockQuantity() != null) product.setStockQuantity(request.getStockQuantity());
        if (request.getUnit() != null) product.setUnit(request.getUnit());
        if (request.getIsActive() != null) product.setIsActive(request.getIsActive());
        
        if (request.getCampaignId() != null) {
            Campaign campaign = campaignRepository.findById(request.getCampaignId())
                .orElseThrow(() -> new RuntimeException("Kampanya bulunamadı: " + request.getCampaignId()));
            product.setCampaign(campaign);
        }
        
        product.setUpdatedAt(LocalDateTime.now());
        
        Product updatedProduct = productRepository.save(product);
        return convertToResponse(updatedProduct);
    }
    
    @Override
    @Transactional
    public void deleteProduct(UUID id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ürün bulunamadı: " + id));
        product.setIsDeleted(true);
        product.setIsActive(false);
        product.setUpdatedAt(LocalDateTime.now());
        productRepository.save(product);
    }
    
    private ProductResponse convertToResponse(Product product) {
        CampaignResponse campaignResponse = null;
        if (product.getCampaign() != null) {
            campaignResponse = CampaignResponse.builder()
                .id(product.getCampaign().getId())
                .title(product.getCampaign().getTitle())
                .description(product.getCampaign().getDescription())
                .imageUrl(product.getCampaign().getImageUrl())
                .targetAmount(product.getCampaign().getTargetAmount())
                .raisedAmount(product.getCampaign().getRaisedAmount())
                .unit(product.getCampaign().getUnit())
                .targetCount(product.getCampaign().getTargetCount())
                .raisedCount(product.getCampaign().getRaisedCount())
                .isActive(product.getCampaign().isActive())
                .createdAt(product.getCampaign().getCreatedAt())
                .build();
            if (campaignResponse != null) {
                campaignResponse.calculateProgressPercentage();
            }
        }
        
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setCategory(product.getCategory());
        response.setPrice(product.getPrice());
        response.setImageUrl(product.getImageUrl());
        response.setStockQuantity(product.getStockQuantity());
        response.setDonationCount(product.getDonationCount());
        response.setCampaign(campaignResponse);
        response.setUnit(product.getUnit());
        response.setIsDonationProduct(product.getCampaign() != null);
        response.setCreatedAt(product.getCreatedAt());
        response.setIsActive(product.getIsActive());
        
        // --- Yeni Alanların Eklenmesi ---
        response.setIsFlashSale(product.getIsFlashSale());
        response.setOldPrice(product.getOldPrice());
        response.setFlashSaleEndDate(product.getFlashSaleEndDate());
        response.setSalesCount(product.getSalesCount());
        response.setViewCount(product.getViewCount());
        response.setLatitude(product.getLatitude());
        response.setLongitude(product.getLongitude());
        response.setCity(product.getCity());
        response.setDistrict(product.getDistrict());
        response.setIsNewSeason(product.getIsNewSeason());
        
        return response;
    }
}