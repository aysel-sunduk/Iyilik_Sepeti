package com.donatecommerce.config;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.donatecommerce.entity.Campaign;
import com.donatecommerce.entity.Category;
import com.donatecommerce.entity.CategoryType;
import com.donatecommerce.entity.Product;
import com.donatecommerce.repository.CampaignRepository;
import com.donatecommerce.repository.CategoryRepository;
import com.donatecommerce.repository.ProductRepository;
@Component
@SuppressWarnings("null")
public class DataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CampaignRepository campaignRepository;

    public DataInitializer(ProductRepository productRepository, 
                           CategoryRepository categoryRepository, 
                           CampaignRepository campaignRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.campaignRepository = campaignRepository;
    }

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
        // Kategori güncellemeleri ve yeni görsellerin atanması
        syncCategory("Temel Gıda", "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1074&auto=format&fit=crop");
        syncCategory("Eğitim & Kırtasiye", "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?q=80&w=1170&auto=format&fit=crop");
        syncCategory("Evcil Hayvan", "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1169&auto=format&fit=crop");
        syncCategory("Giyim & Aksesuar", "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1170&auto=format&fit=crop");
        syncCategory("Temizlik & Hijyen", "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1170&auto=format&fit=crop");
        syncCategory("Anne & Çocuk", "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=1175&auto=format&fit=crop");

        // Eğer hiç kategori yoksa temel seti oluştur
        if (categoryRepository.count() == 0) {
            seedCategories();
        }
    }

    private void syncCategory(String name, String imageUrl) {
        categoryRepository.findByName(name).ifPresentOrElse(category -> {
            category.setImageUrl(imageUrl);
            categoryRepository.save(category);
            System.out.println("Kategori görseli güncellendi: " + name);
        }, () -> {
            // Eğer kategori yoksa, seedCategories zaten oluşturacak, burada bir şey yapmaya gerek yok
        });
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
                .imageUrl("https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1074&auto=format&fit=crop")
                .type(CategoryType.BOTH)
                .isActive(true)
                .build();

        Category cat2 = Category.builder()
                .name("Eğitim & Kırtasiye")
                .nameSlug("egitim-kirtasiye")
                .description("Eğitim ve kırtasiye malzemeleri")
                .imageUrl("https://images.unsplash.com/photo-1452860606245-08befc0ff44b?q=80&w=1170&auto=format&fit=crop")
                .type(CategoryType.BOTH)
                .isActive(true)
                .build();

        Category cat3 = Category.builder()
                .name("Evcil Hayvan")
                .nameSlug("evcil-hayvan")
                .description("Sokak hayvanları ve evcil dostlarımız için yardımlar")
                .imageUrl("https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1169&auto=format&fit=crop")
                .type(CategoryType.DONATION)
                .isActive(true)
                .build();

        Category cat4 = Category.builder()
                .name("Giyim & Aksesuar")
                .nameSlug("giyim-aksesuar")
                .description("İhtiyaç sahipleri için giyim yardımları")
                .imageUrl("https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1170&auto=format&fit=crop")
                .type(CategoryType.BOTH)
                .isActive(true)
                .build();

        Category cat5 = Category.builder()
                .name("Temizlik & Hijyen")
                .nameSlug("temizlik-hijyen")
                .description("Kişisel temizlik ve hijyen ürünleri")
                .imageUrl("https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1170&auto=format&fit=crop")
                .type(CategoryType.BOTH)
                .isActive(true)
                .build();

        categoryRepository.saveAll(List.of(cat1, cat2, cat3, cat4, cat5));
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

        campaignRepository.saveAll(List.of(camp1, camp2));
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
        p1.setSalesCount(150); // Popüler olması için
        p1.setCampaign(streetAnimals);
        p1.setUnit("paket");
        p1.setIsActive(true);
        p1.setLatitude(41.0082); // İstanbul koordinatları (Yakınımda testi için)
        p1.setLongitude(28.9784);
        p1.setIsNewSeason(true); // Yeni sezon testi için

        Product p2 = new Product();
        p2.setName("Temel Gıda Kolisi");
        p2.setDescription("Yağ, un, şeker ve bakliyat içeren yardım kolisi.");
        p2.setCategory("Temel Gıda");
        p2.setPrice(new BigDecimal("450.00"));
        p2.setOldPrice(new BigDecimal("600.00"));
        p2.setStockQuantity(100);
        p2.setDonationCount(45);
        p2.setSalesCount(60);
        p2.setUnit("koli");
        p2.setIsActive(true);
        p2.setIsFlashSale(true); // Flaş indirim testi için
        p2.setFlashSaleEndDate(LocalDateTime.now().plusDays(2)); // İki gün süresi var
        p2.setLatitude(41.0050);
        p2.setLongitude(28.9750);

        productRepository.saveAll(List.of(p1, p2));
    }
}
