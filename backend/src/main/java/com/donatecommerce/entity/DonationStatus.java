package com.donatecommerce.entity;

public enum DonationStatus {
    PENDING,    // Bağış alındı, işleme bekleniyor
    PREPARING,  // Bağış hazırlanıyor
    COLLECTING, // Toplanıyor
    COLLECTED,  // Toplama merkezine ulaştı
    SHIPPING,   // İhtiyaç bölgesine sevk edildi
    SHIPPED,    // Kargoya verildi
    DELIVERED,  // İhtiyaç sahibine ulaştırıldı
    COMPLETED,  // Tamamlandı
    CANCELLED,  // İptal edildi
    PAID,       // Ödendi
    FAILED      // Başarısız
}
