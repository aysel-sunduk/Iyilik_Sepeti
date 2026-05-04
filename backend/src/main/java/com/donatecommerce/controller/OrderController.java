package com.donatecommerce.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.donatecommerce.dto.request.CancelOrderRequest;
import com.donatecommerce.dto.request.CreateOrderRequest;
import com.donatecommerce.dto.response.OrderResponse;
import com.donatecommerce.service.OrderService;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Siparişler", description = "Sipariş yönetimi API'leri")
public class OrderController {
    
    private final OrderService orderService;
    
    /**
     * Yeni sipariş oluşturma
     * POST /api/orders
     */
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @RequestBody @Valid CreateOrderRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        OrderResponse response = orderService.createOrder(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * Kullanıcının siparişlerini listeleme
     * GET /api/orders/my-orders
     * GET /api/orders/my-orders?status=PROCESSING
     */
    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderResponse>> getMyOrders(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String status) {
        
        List<OrderResponse> orders = orderService.getMyOrders(userDetails.getUsername(), status);
        return ResponseEntity.ok(orders);
    }
    
    /**
     * Sipariş detayı
     * GET /api/orders/{orderId}
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderDetail(
            @PathVariable UUID orderId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        OrderResponse response = orderService.getOrderDetail(orderId, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }
    
    /**
     * Sipariş iptali
     * POST /api/orders/{orderId}/cancel
     */
    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(
            @PathVariable UUID orderId,
            @RequestBody(required = false) CancelOrderRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        OrderResponse response = orderService.cancelOrder(
                orderId, 
                request != null ? request : new CancelOrderRequest(), 
                userDetails.getUsername());
        return ResponseEntity.ok(response);
    }
}