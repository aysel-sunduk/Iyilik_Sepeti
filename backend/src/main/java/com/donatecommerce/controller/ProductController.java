package com.donatecommerce.controller;

import com.donatecommerce.dto.response.ApiResponse;
import com.donatecommerce.entity.Product;
import com.donatecommerce.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "Ürün işlemleri")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "Tüm aktif ürünleri getir")
    public ResponseEntity<ApiResponse<List<Product>>> getAllProducts() {
        List<Product> products = productService.getAllActiveProducts();
        return ResponseEntity.ok(ApiResponse.success(products, "Ürünler başarıyla getirildi"));
    }

    @GetMapping("/popular")
    @Operation(summary = "Popüler ürünleri getir (limitli)")
    public ResponseEntity<ApiResponse<List<Product>>> getPopularProducts(@RequestParam(defaultValue = "10") int limit) {
        List<Product> products = productService.getPopularProducts(limit);
        return ResponseEntity.ok(ApiResponse.success(products, "Popüler ürünler getirildi"));
    }

    @GetMapping("/category/{categoryName}")
    @Operation(summary = "Kategoriye göre ürünleri getir")
    public ResponseEntity<ApiResponse<List<Product>>> getProductsByCategory(@PathVariable String categoryName) {
        List<Product> products = productService.getProductsByCategory(categoryName);
        return ResponseEntity.ok(ApiResponse.success(products, categoryName + " kategorisindeki ürünler getirildi"));
    }
}
