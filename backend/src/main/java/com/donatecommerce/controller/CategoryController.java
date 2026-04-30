// controller/CategoryController.java
package com.donatecommerce.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.web.bind.annotation.RestController;

import com.donatecommerce.dto.request.CategoryCreateRequest;
import com.donatecommerce.dto.response.ApiResponse;
import com.donatecommerce.dto.response.CategoryResponse;
import com.donatecommerce.entity.CategoryType;
import com.donatecommerce.service.CategoryService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
@Tag(name = "Kategoriler", description = "Kategori yönetimi API'leri")
public class CategoryController {
    
    @Autowired
    private CategoryService categoryService;
    
    @GetMapping
    @Operation(summary = "Tüm kategorileri getir")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories(HttpServletRequest request) {
        List<CategoryResponse> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success(categories, "Kategoriler başarıyla getirildi"));
    }
    
    @GetMapping("/active")
    @Operation(summary = "Aktif kategorileri getir")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getActiveCategories(HttpServletRequest request) {
        List<CategoryResponse> categories = categoryService.getActiveCategories();
        return ResponseEntity.ok(ApiResponse.success(categories, "Aktif kategoriler başarıyla getirildi"));
    }
    
    @GetMapping("/type/{type}")
    @Operation(summary = "Tipine göre kategorileri getir", description = "SHOPPING, DONATION, BOTH")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getCategoriesByType(
            @PathVariable CategoryType type,
            HttpServletRequest request) {
        List<CategoryResponse> categories = categoryService.getCategoriesByType(type);
        return ResponseEntity.ok(ApiResponse.success(categories, type + " tipindeki kategoriler başarıyla getirildi"));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "ID'ye göre kategori getir")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(
            @PathVariable UUID id,
            HttpServletRequest request) {
        try {
            CategoryResponse category = categoryService.getCategoryById(id);
            return ResponseEntity.ok(ApiResponse.success(category, "Kategori başarıyla getirildi"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), request.getRequestURI()));
        }
    }
    
    @GetMapping("/name/{name}")
    @Operation(summary = "İsme göre kategori getir")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryByName(
            @PathVariable String name,
            HttpServletRequest request) {
        try {
            CategoryResponse category = categoryService.getCategoryByName(name);
            return ResponseEntity.ok(ApiResponse.success(category, "Kategori başarıyla getirildi"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), request.getRequestURI()));
        }
    }
    
    @PostMapping
    @Operation(summary = "Yeni kategori oluştur")
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(
            @RequestBody CategoryCreateRequest request,
            HttpServletRequest httpRequest) {
        try {
            CategoryResponse createdCategory = categoryService.createCategory(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success(createdCategory, "Kategori başarıyla oluşturuldu"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage(), httpRequest.getRequestURI()));
        }
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Kategori güncelle")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
            @PathVariable UUID id,
            @RequestBody CategoryCreateRequest request,
            HttpServletRequest httpRequest) {
        try {
            CategoryResponse updatedCategory = categoryService.updateCategory(id, request);
            return ResponseEntity.ok(ApiResponse.success(updatedCategory, "Kategori başarıyla güncellendi"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), httpRequest.getRequestURI()));
        }
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Kategori sil (soft delete)")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(
            @PathVariable UUID id,
            HttpServletRequest request) {
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.ok(ApiResponse.success(null, "Kategori başarıyla silindi"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), request.getRequestURI()));
        }
    }
}