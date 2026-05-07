// controller/ProductController.java
package com.donatecommerce.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.donatecommerce.dto.request.ProductCreateRequest;
import com.donatecommerce.dto.request.ProductFilterRequest;
import com.donatecommerce.dto.request.ProductUpdateRequest;
import com.donatecommerce.dto.response.ApiResponse;
import com.donatecommerce.dto.response.ProductResponse;
import com.donatecommerce.service.ProductService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")

@Tag(name = "Ürünler", description = "Ürün yönetimi API'leri")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    @Operation(summary = "Tüm ürünleri getir")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAllProducts(HttpServletRequest request) {
        List<ProductResponse> products = productService.getAllProducts();
        return ResponseEntity.ok(ApiResponse.success(products, "Ürünler başarıyla getirildi"));
    }

    @GetMapping("/filter")
    @Operation(summary = "Filtreli ürünleri getir", description = "Kategori, bağış ürünü, fiyat aralığı gibi filtrelerle ürünleri listeler")
    public ResponseEntity<ApiResponse<Page<ProductResponse>>> getProductsWithFilters(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean isDonationProduct,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Integer minDonationCount,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection,
            HttpServletRequest request) {

        ProductFilterRequest filterRequest = new ProductFilterRequest();
        filterRequest.setCategory(category);
        filterRequest.setIsDonationProduct(isDonationProduct);
        filterRequest.setSearch(search);
        if (minPrice != null)
            filterRequest.setMinPrice(java.math.BigDecimal.valueOf(minPrice));
        if (maxPrice != null)
            filterRequest.setMaxPrice(java.math.BigDecimal.valueOf(maxPrice));
        filterRequest.setMinDonationCount(minDonationCount);
        filterRequest.setInStock(inStock);
        filterRequest.setPage(page);
        filterRequest.setSize(size);
        filterRequest.setSortBy(sortBy);
        filterRequest.setSortDirection(sortDirection);

        Page<ProductResponse> products = productService.getProductsWithFilters(filterRequest);
        return ResponseEntity.ok(ApiResponse.success(products, "Filtrelenmiş ürünler başarıyla getirildi"));
    }

    @GetMapping("/donation")
    @Operation(summary = "Bağış ürünlerini getir")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getDonationProducts(HttpServletRequest request) {
        List<ProductResponse> products = productService.getDonationProducts();
        return ResponseEntity.ok(ApiResponse.success(products, "Bağış ürünleri başarıyla getirildi"));
    }

    @GetMapping("/donation/popular")
    @Operation(summary = "Popüler bağış ürünlerini getir")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getPopularDonationProducts(
            @RequestParam(defaultValue = "6") int limit,
            HttpServletRequest request) {
        List<ProductResponse> products = productService.getPopularDonationProducts(limit);
        return ResponseEntity.ok(ApiResponse.success(products, "Popüler bağış ürünleri başarıyla getirildi"));
    }

    @GetMapping("/flash-sales")
    @Operation(summary = "Flaş indirimdeki ürünleri getir")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getFlashSales(HttpServletRequest request) {
        List<ProductResponse> products = productService.getFlashSales();
        return ResponseEntity.ok(ApiResponse.success(products, "Flaş indirim ürünleri başarıyla getirildi"));
    }

    @GetMapping("/nearby")
    @Operation(summary = "Yakındaki ürünleri getir")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getNearbyProducts(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam(defaultValue = "5.0") Double radiusKm,
            HttpServletRequest request) {
        List<ProductResponse> products = productService.getNearbyProducts(lat, lng, radiusKm);
        return ResponseEntity.ok(ApiResponse.success(products, "Yakındaki ürünler başarıyla getirildi"));
    }

    @GetMapping("/category/{category}")
    @Operation(summary = "Kategoriye göre ürünleri getir")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getProductsByCategory(
            @PathVariable String category,
            HttpServletRequest request) {
        List<ProductResponse> products = productService.getProductsByCategory(category);
        return ResponseEntity
                .ok(ApiResponse.success(products, category + " kategorisine ait ürünler başarıyla getirildi"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "ID'ye göre ürün getir")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(
            @PathVariable UUID id,
            HttpServletRequest request) {
        try {
            ProductResponse product = productService.getProductById(id);
            return ResponseEntity.ok(ApiResponse.success(product, "Ürün başarıyla getirildi"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), request.getRequestURI()));
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Yeni ürün oluştur")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
            @RequestBody ProductCreateRequest request,
            HttpServletRequest httpRequest) {
        try {
            ProductResponse createdProduct = productService.createProduct(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success(createdProduct, "Ürün başarıyla oluşturuldu"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage(), httpRequest.getRequestURI()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Ürün güncelle")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @PathVariable UUID id,
            @RequestBody ProductUpdateRequest request,
            HttpServletRequest httpRequest) {
        try {
            ProductResponse updatedProduct = productService.updateProduct(id, request);
            return ResponseEntity.ok(ApiResponse.success(updatedProduct, "Ürün başarıyla güncellendi"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), httpRequest.getRequestURI()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Ürün sil (soft delete)")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(
            @PathVariable UUID id,
            HttpServletRequest request) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok(ApiResponse.success(null, "Ürün başarıyla silindi"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), request.getRequestURI()));
        }
    }
}