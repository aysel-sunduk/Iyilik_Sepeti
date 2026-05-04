package com.donatecommerce.service;

import com.donatecommerce.entity.Category;
import com.donatecommerce.entity.Product;
import com.donatecommerce.entity.Campaign;
import com.donatecommerce.entity.CategoryType;
import com.donatecommerce.repository.CategoryRepository;
import com.donatecommerce.repository.ProductRepository;
import com.donatecommerce.repository.CampaignRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SeedDataService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CampaignRepository campaignRepository;

    @Transactional
    public int cleanAndSeedTurkishProducts() {
        // 1. Mevcut verileri temizle
        log.info("Eski veriler temizleniyor...");
        productRepository.deleteAll();
        campaignRepository.deleteAll();
        categoryRepository.deleteAll();

        // 2. Kampanyaları Oluştur
        log.info("Kampanyalar oluşturuluyor...");
        campaignRepository.save(Campaign.builder()
                .title("Deprem Bölgesi Kırtasiye Desteği")
                .description("Hatay ve Adıyaman'daki öğrencilerimiz için okul çantası ve kırtasiye seti topluyoruz.")
                .targetAmount(BigDecimal.valueOf(50000))
                .raisedAmount(BigDecimal.valueOf(12500))
                .targetCount(500)
                .raisedCount(125)
                .unit("adet")
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .build());

        campaignRepository.save(Campaign.builder()
                .title("Sokak Hayvanları İçin Kış Desteği")
                .description("Barınaklardaki dostlarımız için battaniye ve mama desteği.")
                .targetAmount(BigDecimal.valueOf(25000))
                .raisedAmount(BigDecimal.valueOf(18000))
                .targetCount(1000)
                .raisedCount(720)
                .unit("kg")
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .build());

        // 3. Kategorileri oluştur...
        createCategory("gıda", CategoryType.BOTH);
        createCategory("giyim", CategoryType.BOTH);
        createCategory("hijyen", CategoryType.BOTH);
        createCategory("çocuk", CategoryType.BOTH);
        createCategory("hayvan", CategoryType.DONATION);

        // 3. 100 Adet Ürünü Hazırla
        List<Product> products = new ArrayList<>();

        // GIDA (20 Ürün)
        products.add(create("Çaykur Rize Turist Çay 500 gr", 95.50,
                "https://cdn.getir.com/product/5ed6628203c94294026857cb_tr_1615555198038.jpeg", "Gıda"));
        products.add(create("Filiz Burgu Makarna 500 gr", 18.90,
                "https://cdn.getir.com/product/5c138f61543884000b0e515e_tr_1625740445738.jpeg", "Gıda"));
        products.add(create("Biryağ Ayçiçek Yağı 1 lt", 55.00,
                "https://cdn.getir.com/product/5c138f61543884000b0e515e_tr_1625740445738.jpeg", "Gıda"));
        products.add(create("Torku Toz Şeker 1 kg", 32.50,
                "https://cdn.getir.com/product/567406821213f70300746979_tr_1615553018241.jpeg", "Gıda"));
        products.add(create("Ülker Pötibör Bisküvi 175 gr", 12.00,
                "https://cdn.getir.com/product/5579737113ed7304005b6329_tr_1631278278438.jpeg", "gıda"));
        products.add(create("Sütaş Yarım Yağlı Süt 1 lt", 28.50,
                "https://cdn.getir.com/product/5ed6628203c94294026857cb_tr_1615555198038.jpeg", "gıda"));
        products.add(create("Doğuş Karadeniz Çayı 1 kg", 145.00,
                "https://cdn.getir.com/product/567406821213f70300746979_tr_1615553018241.jpeg", "gıda"));
        products.add(create("Efsane Pilavlık Pirinç 1 kg", 42.00,
                "https://cdn.getir.com/product/5c138f61543884000b0e515e_tr_1625740445738.jpeg", "gıda"));
        products.add(create("Tat Domates Salçası 830 gr", 38.00,
                "https://cdn.getir.com/product/5579737113ed7304005b6329_tr_1631278278438.jpeg", "gıda"));
        products.add(create("Lipton Doğu Karadeniz Poşet Çay", 45.00,
                "https://cdn.getir.com/product/5ed6628203c94294026857cb_tr_1615555198038.jpeg", "gıda"));
        products.add(create("Barilla Spagetti 500 gr", 25.00,
                "https://cdn.getir.com/product/5c138f61543884000b0e515e_tr_1625740445738.jpeg", "gıda"));
        products.add(create("Söke Un 1 kg", 24.50,
                "https://cdn.getir.com/product/567406821213f70300746979_tr_1615553018241.jpeg", "gıda"));
        products.add(create("Marmarabirlik Zeytin 500 gr", 85.00,
                "https://cdn.getir.com/product/5579737113ed7304005b6329_tr_1631278278438.jpeg", "gıda"));
        products.add(create("Sütaş Beyaz Peynir 500 gr", 120.00,
                "https://cdn.getir.com/product/5ed6628203c94294026857cb_tr_1615555198038.jpeg", "gıda"));
        products.add(create("Yayla Kırmızı Mercimek 1 kg", 48.00,
                "https://cdn.getir.com/product/5c138f61543884000b0e515e_tr_1625740445738.jpeg", "gıda"));
        products.add(create("Duru Pilavlık Bulgur 1 kg", 35.00,
                "https://cdn.getir.com/product/567406821213f70300746979_tr_1615553018241.jpeg", "gıda"));
        products.add(create("Nutella 400 gr", 75.00,
                "https://cdn.getir.com/product/5579737113ed7304005b6329_tr_1631278278438.jpeg", "gıda"));
        products.add(create("Pınar Labne 200 gr", 42.00,
                "https://cdn.getir.com/product/5ed6628203c94294026857cb_tr_1615555198038.jpeg", "gıda"));
        products.add(create("Balparmak Bal 350 gr", 135.00,
                "https://cdn.getir.com/product/5c138f61543884000b0e515e_tr_1625740445738.jpeg", "gıda"));
        products.add(create("Nescafe Gold 100 gr", 110.00,
                "https://cdn.getir.com/product/567406821213f70300746979_tr_1615553018241.jpeg", "gıda"));

        // GİYİM (20 Ürün)
        products.add(create("Erkek Pamuklu Tişört", 199.90,
                "https://img-lcwaikiki.mncdn.com/mnresize/1024/-/pim/productimages/20232/6641561/L_20232-S3F373Z8-LRN_A.jpg",
                "Giyim"));
        products.add(create("Kadın Triko Kazak", 349.90,
                "https://img-lcwaikiki.mncdn.com/mnresize/1024/-/pim/productimages/20232/6641561/L_20232-S3F373Z8-LRN_A.jpg",
                "Giyim"));
        products.add(create("Çocuk Kapüşonlu Sweat", 250.00,
                "https://img-lcwaikiki.mncdn.com/mnresize/1024/-/pim/productimages/20232/6641561/L_20232-S3F373Z8-LRN_A.jpg",
                "Giyim"));
        products.add(create("Erkek Jean Pantolon", 450.00,
                "https://img-lcwaikiki.mncdn.com/mnresize/1024/-/pim/productimages/20232/6641561/L_20232-S3F373Z8-LRN_A.jpg",
                "Giyim"));
        products.add(create("Kadın Şişme Mont", 899.00,
                "https://img-lcwaikiki.mncdn.com/mnresize/1024/-/pim/productimages/20232/6641561/L_20232-S3F373Z8-LRN_A.jpg",
                "Giyim"));
        products.add(create("Polar Bere Eldiven Seti", 120.00,
                "https://img-lcwaikiki.mncdn.com/mnresize/1024/-/pim/productimages/20232/6641561/L_20232-S3F373Z8-LRN_A.jpg",
                "giyim"));
        products.add(create("Yünlü Kışlık Atkı", 150.00,
                "https://img-lcwaikiki.mncdn.com/mnresize/1024/-/pim/productimages/20232/6641561/L_20232-S3F373Z8-LRN_A.jpg",
                "giyim"));
        products.add(create("Spor Ayakkabı Beyaz", 650.00,
                "https://img-lcwaikiki.mncdn.com/mnresize/1024/-/pim/productimages/20232/6641561/L_20232-S3F373Z8-LRN_A.jpg",
                "giyim"));
        products.add(create("Kışlık Bot Siyah", 850.00,
                "https://img-lcwaikiki.mncdn.com/mnresize/1024/-/pim/productimages/20232/6641561/L_20232-S3F373Z8-LRN_A.jpg",
                "giyim"));
        products.add(create("Bebek Uyku Tulumu", 220.00,
                "https://img-lcwaikiki.mncdn.com/mnresize/1024/-/pim/productimages/20232/6641561/L_20232-S3F373Z8-LRN_A.jpg",
                "giyim"));
        products.add(create("Erkek Kargo Pantolon", 380.00,
                "https://img-lcwaikiki.mncdn.com/mnresize/1024/-/pim/productimages/20232/6641561/L_20232-S3F373Z8-LRN_A.jpg",
                "giyim"));
        products.add(create("Kadın Şifon Elbise", 420.00,
                "https://img-lcwaikiki.mncdn.com/mnresize/1024/-/pim/productimages/20232/6641561/L_20232-S3F373Z8-LRN_A.jpg",
                "giyim"));
        products.add(create("Yağmurluk Unisex", 320.00,
                "https://img-lcwaikiki.mncdn.com/mnresize/1024/-/pim/productimages/20232/6641561/L_20232-S3F373Z8-LRN_A.jpg",
                "giyim"));
        products.add(create("Kışlık Çorap 3'lü", 75.00,
                "https://img-lcwaikiki.mncdn.com/mnresize/1024/-/pim/productimages/20232/6641561/L_20232-S3F373Z8-LRN_A.jpg",
                "giyim"));
        products.add(create("Termal İçlik Takımı", 280.00,
                "https://img-lcwaikiki.mncdn.com/mnresize/1024/-/pim/productimages/20232/6641561/L_20232-S3F373Z8-LRN_A.jpg",
                "giyim"));
        products.add(create("Erkek Deri Kemer", 130.00,
                "https://img-lcwaikiki.mncdn.com/mnresize/1024/-/pim/productimages/20232/6641561/L_20232-S3F373Z8-LRN_A.jpg",
                "giyim"));
        products.add(create("Kadın Kol Çantası", 250.00,
                "https://img-lcwaikiki.mncdn.com/mnresize/1024/-/pim/productimages/20232/6641561/L_20232-S3F373Z8-LRN_A.jpg",
                "giyim"));
        products.add(create("Çocuk Montu Mavi", 480.00,
                "https://img-lcwaikiki.mncdn.com/mnresize/1024/-/pim/productimages/20232/6641561/L_20232-S3F373Z8-LRN_A.jpg",
                "giyim"));
        products.add(create("Unisex Spor Sweat", 310.00,
                "https://img-lcwaikiki.mncdn.com/mnresize/1024/-/pim/productimages/20232/6641561/L_20232-S3F373Z8-LRN_A.jpg",
                "giyim"));
        products.add(create("Kadın Kot Ceket", 450.00,
                "https://img-lcwaikiki.mncdn.com/mnresize/1024/-/pim/productimages/20232/6641561/L_20232-S3F373Z8-LRN_A.jpg",
                "giyim"));

        // HİJYEN (20 Ürün)
        products.add(create("Domestos 750 ml", 45.00,
                "https://cdn.getir.com/product/5ed6628203c94294026857cb_tr_1615555198038.jpeg", "Hijyen"));
        products.add(create("Ariel Matik 6 kg", 320.00,
                "https://cdn.getir.com/product/5c138f61543884000b0e515e_tr_1625740445738.jpeg", "Hijyen"));
        products.add(create("Selpak Havlu 12'li", 115.00,
                "https://cdn.getir.com/product/567406821213f70300746979_tr_1615553018241.jpeg", "Hijyen"));
        products.add(create("Prima Bebek Bezi 50'li", 280.00,
                "https://cdn.getir.com/product/5579737113ed7304005b6329_tr_1631278278438.jpeg", "Hijyen"));
        products.add(create("Dove Sıvı Sabun 500 ml", 65.00,
                "https://cdn.getir.com/product/5ed6628203c94294026857cb_tr_1615555198038.jpeg", "Hijyen"));
        products.add(create("Colgate Diş Macunu", 48.00,
                "https://cdn.getir.com/product/5c138f61543884000b0e515e_tr_1625740445738.jpeg", "Hijyen"));
        products.add(create("Oral-B Diş Fırçası 1+1", 75.00,
                "https://cdn.getir.com/product/567406821213f70300746979_tr_1615553018241.jpeg", "hijyen"));
        products.add(create("Familia Tuvalet Kağıdı 32'li", 165.00,
                "https://cdn.getir.com/product/5579737113ed7304005b6329_tr_1631278278438.jpeg", "hijyen"));
        products.add(create("Fairy Bulaşık Det. 1.5 lt", 125.00,
                "https://cdn.getir.com/product/5ed6628203c94294026857cb_tr_1615555198038.jpeg", "hijyen"));
        products.add(create("Finish Tablet 60'lı", 350.00,
                "https://cdn.getir.com/product/5c138f61543884000b0e515e_tr_1625740445738.jpeg", "hijyen"));
        products.add(create("Cif Krem 750 ml", 42.00,
                "https://cdn.getir.com/product/567406821213f70300746979_tr_1615553018241.jpeg", "hijyen"));
        products.add(create("Hacı Şakir Sabun 4'lü", 55.00,
                "https://cdn.getir.com/product/5579737113ed7304005b6329_tr_1631278278438.jpeg", "hijyen"));
        products.add(create("Listerine Ağız Suyu", 85.00,
                "https://cdn.getir.com/product/5ed6628203c94294026857cb_tr_1615555198038.jpeg", "hijyen"));
        products.add(create("Viking Yüzey Tem. 2.5 lt", 65.00,
                "https://cdn.getir.com/product/5c138f61543884000b0e515e_tr_1625740445738.jpeg", "hijyen"));
        products.add(create("Molped Hijyenik Ped", 55.00,
                "https://cdn.getir.com/product/567406821213f70300746979_tr_1615553018241.jpeg", "hijyen"));
        products.add(create("Duru Duş Jeli 450 ml", 70.00,
                "https://cdn.getir.com/product/5579737113ed7304005b6329_tr_1631278278438.jpeg", "hijyen"));
        products.add(create("Gillete Tıraş Bıçağı 10'lu", 145.00,
                "https://cdn.getir.com/product/5ed6628203c94294026857cb_tr_1615555198038.jpeg", "hijyen"));
        products.add(create("Arko Tıraş Köpüğü", 45.00,
                "https://cdn.getir.com/product/5c138f61543884000b0e515e_tr_1625740445738.jpeg", "hijyen"));
        products.add(create("Nivea Roll-On", 95.00,
                "https://cdn.getir.com/product/567406821213f70300746979_tr_1615553018241.jpeg", "hijyen"));
        products.add(create("Eyüp Sabri Kolonya", 35.00,
                "https://cdn.getir.com/product/5579737113ed7304005b6329_tr_1631278278438.jpeg", "hijyen"));

        // ÇOCUK (20 Ürün)
        products.add(create("Boyama Seti 24 Parça", 85.00,
                "https://images.deliveryhero.io/image/fd-tr/Products/1234567.jpg", "Çocuk"));
        products.add(create("Okul Sırt Çantası", 250.00,
                "https://images.deliveryhero.io/image/fd-tr/Products/1234567.jpg", "Çocuk"));
        products.add(create("Peluş Ayı 30 cm", 145.00,
                "https://images.deliveryhero.io/image/fd-tr/Products/1234567.jpg", "Çocuk"));
        products.add(create("Lego İtfaiye Seti", 420.00,
                "https://images.deliveryhero.io/image/fd-tr/Products/1234567.jpg", "Çocuk"));
        products.add(create("Kırtasiye Seti", 110.00, "https://images.deliveryhero.io/image/fd-tr/Products/1234567.jpg",
                "Çocuk"));
        products.add(create("Pilsan Akülü Araba", 3500.00,
                "https://images.deliveryhero.io/image/fd-tr/Products/1234567.jpg", "Çocuk"));
        products.add(create("Bebek Çıngırak Seti", 65.00,
                "https://images.deliveryhero.io/image/fd-tr/Products/1234567.jpg", "Çocuk"));
        products.add(create("Eğitici Kartlar Seti", 45.00,
                "https://images.deliveryhero.io/image/fd-tr/Products/1234567.jpg", "çocuk"));
        products.add(create("Masal Kitabı Seti", 120.00,
                "https://images.deliveryhero.io/image/fd-tr/Products/1234567.jpg", "çocuk"));
        products.add(create("Barbie Bebek", 280.00, "https://images.deliveryhero.io/image/fd-tr/Products/1234567.jpg",
                "çocuk"));
        products.add(create("Uzaktan Kumandalı Araba", 195.00,
                "https://images.deliveryhero.io/image/fd-tr/Products/1234567.jpg", "çocuk"));
        products.add(create("Puzzle 100 Parça", 55.00,
                "https://images.deliveryhero.io/image/fd-tr/Products/1234567.jpg", "çocuk"));
        products.add(create("Plastik Top 3'lü", 45.00,
                "https://images.deliveryhero.io/image/fd-tr/Products/1234567.jpg", "çocuk"));
        products.add(create("Beslenme Çantası", 95.00,
                "https://images.deliveryhero.io/image/fd-tr/Products/1234567.jpg", "çocuk"));
        products.add(create("Okul Kalem Kutusu", 65.00,
                "https://images.deliveryhero.io/image/fd-tr/Products/1234567.jpg", "çocuk"));
        products.add(create("Oyun Hamuru Seti", 85.00,
                "https://images.deliveryhero.io/image/fd-tr/Products/1234567.jpg", "çocuk"));
        products.add(create("Yazı Tahtası", 145.00, "https://images.deliveryhero.io/image/fd-tr/Products/1234567.jpg",
                "çocuk"));
        products.add(create("Çocuk Bisikleti", 1850.00,
                "https://images.deliveryhero.io/image/fd-tr/Products/1234567.jpg", "çocuk"));
        products.add(create("Kum Boyama Seti", 35.00, "https://images.deliveryhero.io/image/fd-tr/Products/1234567.jpg",
                "çocuk"));
        products.add(create("Gece Lambası", 125.00, "https://images.deliveryhero.io/image/fd-tr/Products/1234567.jpg",
                "çocuk"));

        // HAYVAN (20 Ürün)
        products.add(create("Whiskas Kedi Maması", 145.00,
                "https://cdn.getir.com/product/5ed6628203c94294026857cb_tr_1615555198038.jpeg", "Hayvan"));
        products.add(create("Pedigree Köpek Maması", 280.00,
                "https://cdn.getir.com/product/5c138f61543884000b0e515e_tr_1625740445738.jpeg", "Hayvan"));
        products.add(create("Kedi Kumu 10 lt", 120.00,
                "https://cdn.getir.com/product/567406821213f70300746979_tr_1615553018241.jpeg", "Hayvan"));
        products.add(create("Felix Islak Mama 4'lü", 65.00,
                "https://cdn.getir.com/product/5579737113ed7304005b6329_tr_1631278278438.jpeg", "Hayvan"));
        products.add(create("Yavru Kedi Maması 2 kg", 550.00,
                "https://cdn.getir.com/product/5ed6628203c94294026857cb_tr_1615555198038.jpeg", "Hayvan"));
        products.add(create("Köpek Tasması", 85.00,
                "https://cdn.getir.com/product/5c138f61543884000b0e515e_tr_1625740445738.jpeg", "Hayvan"));
        products.add(create("Kedi Tırmalama Tahtası", 250.00,
                "https://cdn.getir.com/product/567406821213f70300746979_tr_1615553018241.jpeg", "Hayvan"));
        products.add(create("Köpek Ödül Bisküvisi", 45.00,
                "https://cdn.getir.com/product/5579737113ed7304005b6329_tr_1631278278438.jpeg", "Hayvan"));
        products.add(create("Kuş Yemi 500 gr", 35.00,
                "https://cdn.getir.com/product/5ed6628203c94294026857cb_tr_1615555198038.jpeg", "hayvan"));
        products.add(create("Balık Yemi 100 gr", 25.00,
                "https://cdn.getir.com/product/5c138f61543884000b0e515e_tr_1625740445738.jpeg", "hayvan"));
        products.add(create("Kedi Oyuncak Fare", 30.00,
                "https://cdn.getir.com/product/567406821213f70300746979_tr_1615553018241.jpeg", "hayvan"));
        products.add(create("Köpek Şampuanı", 95.00,
                "https://cdn.getir.com/product/5579737113ed7304005b6329_tr_1631278278438.jpeg", "hayvan"));
        products.add(create("Kedi Taşıma Çantası", 350.00,
                "https://cdn.getir.com/product/5ed6628203c94294026857cb_tr_1615555198038.jpeg", "hayvan"));
        products.add(create("Tavşan Yemi 1 kg", 45.00,
                "https://cdn.getir.com/product/5c138f61543884000b0e515e_tr_1625740445738.jpeg", "hayvan"));
        products.add(create("Kedi Konserve 400 gr", 40.00,
                "https://cdn.getir.com/product/567406821213f70300746979_tr_1615553018241.jpeg", "hayvan"));
        products.add(create("Köpek Isırma Oyuncağı", 65.00,
                "https://cdn.getir.com/product/5579737113ed7304005b6329_tr_1631278278438.jpeg", "hayvan"));
        products.add(create("Kedi Tarağı", 75.00,
                "https://cdn.getir.com/product/5ed6628203c94294026857cb_tr_1615555198038.jpeg", "hayvan"));
        products.add(create("Papağan Yemi Karışık", 85.00,
                "https://cdn.getir.com/product/5c138f61543884000b0e515e_tr_1625740445738.jpeg", "hayvan"));
        products.add(create("Kedi Malt Macunu", 110.00,
                "https://cdn.getir.com/product/567406821213f70300746979_tr_1615553018241.jpeg", "hayvan"));
        products.add(create("Köpek Çelik Su Kabı", 95.00,
                "https://cdn.getir.com/product/5579737113ed7304005b6329_tr_1631278278438.jpeg", "hayvan"));

        productRepository.saveAll(products);
        log.info("100 adet ürün başarıyla kaydedildi.");

        return products.size();
    }

    private void createCategory(String name, CategoryType type) {
        Category category = new Category();
        category.setName(name);
        category.setType(type);
        category.setIsActive(true);
        category.setCreatedAt(LocalDateTime.now());
        categoryRepository.save(category);
    }

    private Product create(String name, double price, String imageUrl, String category) {
        Product p = new Product();
        p.setName(name);
        p.setPrice(BigDecimal.valueOf(price));
        p.setImageUrl(imageUrl);
        p.setCategory(category);
        p.setIsActive(true);
        p.setStockQuantity(100);
        p.setCreatedAt(LocalDateTime.now());
        return p;
    }
}
