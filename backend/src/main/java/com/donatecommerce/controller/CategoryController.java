package com.donatecommerce.controller;

import com.donatecommerce.dto.response.ApiResponse;
import com.donatecommerce.entity.Category;
import com.donatecommerce.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@Tag(name = "Categories", description = "Kategori işlemleri")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    @Operation(summary = "Tüm aktif kategorileri getir")
    public ResponseEntity<ApiResponse<List<Category>>> getAllCategories() {
        List<Category> categories = categoryService.getActiveCategories();
        return ResponseEntity.ok(ApiResponse.success(categories, "Kategoriler başarıyla getirildi"));
    }
}
