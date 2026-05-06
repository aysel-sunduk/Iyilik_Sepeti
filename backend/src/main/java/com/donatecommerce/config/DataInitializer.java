package com.donatecommerce.config;

import com.donatecommerce.entity.Campaign;
import com.donatecommerce.entity.Category;
import com.donatecommerce.entity.CategoryType;
import com.donatecommerce.entity.Product;
import com.donatecommerce.repository.CampaignRepository;
import com.donatecommerce.repository.CategoryRepository;
import com.donatecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CampaignRepository campaignRepository;

    @Override
    public void run(String... args) {
        // Kategorileri her zaman kontrol et ve güncelle/ekle
        seedOrUpdateCategories();
        
        if (campaignRepository.count() == 0) {
            seedCampaigns();
        }
        if (productRepository.count() == 0) {
            seedProducts();
        }
    }

    private void seedOrUpdateCategories() {
        // Eski isim -> Yeni isim haritası
        updateCategoryName("Gıda", "Temel Gıda");
        updateCategoryName("gıda", "Temel Gıda");
        updateCategoryName("Giyim", "Giyim & Aksesuar");
        updateCategoryName("giyim", "Giyim & Aksesuar");
        updateCategoryName("Hijyen", "Temizlik & Hijyen");
        updateCategoryName("hijyen", "Temizlik & Hijyen");
        updateCategoryName("Çocuk", "Anne & Çocuk");
        updateCategoryName("çocuk", "Anne & Çocuk");
        updateCategoryName("Hayvan", "Evcil Hayvan");
        updateCategoryName("hayvan", "Evcil Hayvan");
        updateCategoryName("Hayvan Hakları", "Evcil Hayvan");
        updateCategoryName("Eğitim", "Eğitim & Kırtasiye");

        // Eğer hiç kategori yoksa temel seti oluştur
        if (categoryRepository.count() == 0) {
            seedCategories();
        }
    }

    private void updateCategoryName(String oldName, String newName) {
        categoryRepository.findByName(oldName).ifPresent(category -> {
            category.setName(newName);
            categoryRepository.save(category);
            System.out.println("Kategori güncellendi: " + oldName + " -> " + newName);
        });
    }

    private void seedCategories() {
        Category cat1 = Category.builder()
                .name("Temel Gıda")
                .nameSlug("temel-gida")
                .description("Temel gıda ihtiyaçları")
                .type(CategoryType.BOTH)
                .isActive(true)
                .build();

        Category cat2 = Category.builder()
                .name("Eğitim & Kırtasiye")
                .nameSlug("egitim-kirtasiye")
                .description("Eğitim ve kırtasiye malzemeleri")
                .type(CategoryType.BOTH)
                .isActive(true)
                .build();

        Category cat3 = Category.builder()
                .name("Evcil Hayvan")
                .nameSlug("evcil-hayvan")
                .description("Sokak hayvanları ve evcil dostlarımız için yardımlar")
                .type(CategoryType.DONATION)
                .isActive(true)
                .build();

        Category cat4 = Category.builder()
                .name("Giyim & Aksesuar")
                .nameSlug("giyim-aksesuar")
                .description("İhtiyaç sahipleri için giyim yardımları")
                .type(CategoryType.BOTH)
                .isActive(true)
                .build();

        Category cat5 = Category.builder()
                .name("Temizlik & Hijyen")
                .nameSlug("temizlik-hijyen")
                .description("Kişisel temizlik ve hijyen ürünleri")
                .type(CategoryType.BOTH)
                .isActive(true)
                .build();

        categoryRepository.saveAll(Arrays.asList(cat1, cat2, cat3, cat4, cat5));
    }

    private void seedCampaigns() {
        Campaign camp1 = Campaign.builder()
                .title("Sokak Hayvanları İçin Mama")
                .description("Kış aylarında sokaktaki dostlarımız aç kalmasın.")
                .targetAmount(new BigDecimal("10000.00"))
                .raisedAmount(new BigDecimal("2500.00"))
                .targetCount(1000)
                .raisedCount(250)
                .unit("kg")
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .build();

        Campaign camp2 = Campaign.builder()
                .title("Köy Okullarına Kitap Desteği")
                .description("İhtiyacı olan okullarımıza kütüphane kuruyoruz.")
                .targetAmount(new BigDecimal("50000.00"))
                .raisedAmount(new BigDecimal("15000.00"))
                .targetCount(5000)
                .raisedCount(1500)
                .unit("kitap")
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .build();

        campaignRepository.saveAll(Arrays.asList(camp1, camp2));
    }

    private void seedProducts() {
        Campaign streetAnimals = campaignRepository.findAll().stream()
                .filter(c -> c.getTitle().contains("Mama"))
                .findFirst().orElse(null);

        Product p1 = new Product();
        p1.setName("Mama Paketi (5kg)");
        p1.setDescription("Sokak hayvanları için besleyici kuru mama.");
        p1.setCategory("Evcil Hayvan");
        p1.setPrice(new BigDecimal("150.00"));
        p1.setStockQuantity(500);
        p1.setDonationCount(120);
        p1.setCampaign(streetAnimals);
        p1.setUnit("paket");
        p1.setIsActive(true);

        Product p2 = new Product();
        p2.setName("Temel Gıda Kolisi");
        p2.setDescription("Yağ, un, şeker ve bakliyat içeren yardım kolisi.");
        p2.setCategory("Temel Gıda");
        p2.setPrice(new BigDecimal("450.00"));
        p2.setStockQuantity(100);
        p2.setDonationCount(45);
        p1.setUnit("koli");
        p2.setIsActive(true);

        productRepository.saveAll(Arrays.asList(p1, p2));
    }
}
