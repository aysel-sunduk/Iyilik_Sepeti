package com.donatecommerce.entity;

public enum OrderStatus {
    PENDING,      // Sipariş alındı, ödeme bekleniyor
    PROCESSING,   // Ödeme onaylandı, hazırlanıyor
    SHIPPED,      // Kargoya verildi
    DELIVERED,    // Teslim edildi
    CANCELLED,    // İptal edildi
    RETURNED      // İade edildi
}