package com.donatecommerce.entity;

public enum DonationStatus {
    PENDING,    // Bağış alındı, işleme bekleniyor
    COLLECTED,  // Toplama merkezine ulaştı
    SHIPPING,   // İhtiyaç bölgesine sevk edildi
    DELIVERED   // İhtiyaç sahibine ulaştırıldı
}
