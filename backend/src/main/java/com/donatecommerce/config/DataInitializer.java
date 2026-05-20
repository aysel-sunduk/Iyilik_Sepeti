package com.donatecommerce.config;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.donatecommerce.entity.Campaign;
import com.donatecommerce.entity.Category;
import com.donatecommerce.entity.CategoryType;
import com.donatecommerce.entity.Product;
import com.donatecommerce.entity.Role;
import com.donatecommerce.entity.User;
import com.donatecommerce.repository.CampaignRepository;
import com.donatecommerce.repository.CategoryRepository;
import com.donatecommerce.repository.ProductRepository;
import com.donatecommerce.repository.RoleRepository;
import com.donatecommerce.entity.Address;
import com.donatecommerce.entity.Donation;
import com.donatecommerce.entity.DonationStatus;
import com.donatecommerce.entity.Payment;
import com.donatecommerce.repository.AddressRepository;
import com.donatecommerce.repository.DonationRepository;
import com.donatecommerce.repository.PaymentRepository;
import com.donatecommerce.repository.UserRepository;
import com.donatecommerce.entity.DonationHub;
import com.donatecommerce.repository.DonationHubRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
@Component
public class DataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CampaignRepository campaignRepository;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final DonationRepository donationRepository;
    private final PaymentRepository paymentRepository;
    private final PasswordEncoder passwordEncoder;
    private final DonationHubRepository donationHubRepository;

    public DataInitializer(ProductRepository productRepository, 
                           CategoryRepository categoryRepository, 
                           CampaignRepository campaignRepository,
                           RoleRepository roleRepository,
                           UserRepository userRepository,
                           AddressRepository addressRepository,
                           DonationRepository donationRepository,
                           PaymentRepository paymentRepository,
                           PasswordEncoder passwordEncoder,
                           DonationHubRepository donationHubRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.campaignRepository = campaignRepository;
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.donationRepository = donationRepository;
        this.paymentRepository = paymentRepository;
        this.passwordEncoder = passwordEncoder;
        this.donationHubRepository = donationHubRepository;
    }

    @Override
    public void run(String... args) {
        // Test kullanıcılarını ve adreslerini oluştur
        seedMockUsers();

        // Kategorileri her zaman kontrol et ve güncelle/ekle
        seedOrUpdateCategories();
        
        if (campaignRepository.count() == 0) {
            seedCampaigns();
        }
        if (productRepository.count() == 0) {
            seedProducts();
        }
        if (donationHubRepository.count() == 0) {
            seedDonationHubs();
        }
    }

    private void seedMockUsers() {
        ensureRoleExists("ADMIN", "Sistem Yöneticisi");
        ensureRoleExists("USER", "Standart Kullanıcı");
        ensureRoleExists("STAFF", "Saha Ekibi");

        createOrUpdateUser("admin@gmail.com", "Admin", "User", "ADMIN", "05551112233");
        createOrUpdateUser("user@gmail.com", "Standart", "User", "USER", "05552223344");
        createOrUpdateUser("staff@gmail.com", "Saha", "Ekibi", "STAFF", "05553334455");
    }

    private void ensureRoleExists(String roleName, String description) {
        if (roleRepository.findByName(roleName).isEmpty()) {
            Role role = new Role();
            role.setName(roleName);
            role.setDescription(description);
            roleRepository.save(role);
            System.out.println("DEBUG: " + roleName + " rolü oluşturuldu!");
        }
    }

    private void createOrUpdateUser(String email, String firstName, String lastName, String roleName, String phone) {
        userRepository.findByEmailIgnoreCase(email).ifPresentOrElse(user -> {
            boolean updated = false;
            if (!passwordEncoder.matches("123456", user.getPasswordHash())) {
                user.setPasswordHash(passwordEncoder.encode("123456"));
                updated = true;
            }
            if (user.getRole() == null || !user.getRole().getName().equals(roleName)) {
                roleRepository.findByName(roleName).ifPresent(user::setRole);
                updated = true;
            }
            if (updated) {
                userRepository.save(user);
                System.out.println("DEBUG: " + email + " kullanıcısı güncellendi (şifre/rol)!");
            }
            ensureMockDataForUser(user);
        }, () -> {
            roleRepository.findByName(roleName).ifPresent(role -> {
                User user = User.builder()
                        .email(email)
                        .passwordHash(passwordEncoder.encode("123456"))
                        .firstName(firstName)
                        .lastName(lastName)
                        .role(role)
                        .phone(phone)
                        .phoneVerified(true)
                        .isActive(true)
                        .isDeleted(false)
                        .createdAt(LocalDateTime.now())
                        .walletBalance(new BigDecimal("1000.00")) // Mock bakiye
                        .build();
                User savedUser = userRepository.save(user);
                System.out.println("DEBUG: Yeni " + email + " (" + roleName + ") kullanıcısı oluşturuldu!");
                ensureMockDataForUser(savedUser);
            });
        });
    }

    private void ensureMockDataForUser(User user) {
        if (addressRepository.findByUserIdAndIsDeletedFalseOrderByIsDefaultDescCreatedAtDesc(user.getId()).isEmpty()) {
            Address address = Address.builder()
                    .user(user)
                    .title("Ev Adresim")
                    .city("İstanbul")
                    .district("Kadıköy")
                    .addressLine("Caferağa Mah. Moda Cad. No: 123 Daire: 4")
                    .postalCode("34710")
                    .isDefault(true)
                    .build();
            addressRepository.save(address);
            System.out.println("DEBUG: " + user.getEmail() + " için varsayılan adres eklendi!");
        }

        if (donationRepository.findByDonorEmailOrderByCreatedAtDesc(user.getEmail()).isEmpty()) {
            productRepository.findAll().stream().findFirst().ifPresent(product -> {
                BigDecimal amount1 = product.getPrice().multiply(new BigDecimal(2));
                Payment p1 = Payment.builder()
                        .user(user)
                        .amount(amount1)
                        .paymentMethod("WALLET")
                        .transactionId(UUID.randomUUID().toString())
                        .status("SUCCESS")
                        .createdAt(LocalDateTime.now().minusDays(1))
                        .build();
                paymentRepository.save(p1);

                String customNote = switch(user.getEmail()) {
                    case "admin@gmail.com" -> "Afet bölgesindeki çocuklara moral vermesi ricasıyla, özenle paketlensin lütfen.";
                    case "user@gmail.com" -> "Yetimhanedeki kardeşlerimize bir nebze de olsa tebessüm olsun diye gönderiyorum.";
                    case "staff@gmail.com" -> "Eğitim desteği kapsamında ihtiyaç sahiplerine dağıtılması için.";
                    default -> "İhtiyaç sahibi minik kardeşlerimize sevgiyle ulaştırılması ricasıyla.";
                };

                Donation mockDonation = Donation.builder()
                        .donor(user)
                        .product(product)
                        .quantity(2)
                        .amount(amount1)
                        .payment(p1)
                        .status(DonationStatus.PENDING)
                        .notes(customNote)
                        .createdAt(LocalDateTime.now().minusDays(1))
                        .build();
                donationRepository.save(mockDonation);
                
                BigDecimal amount2 = product.getPrice();
                Payment p2 = Payment.builder()
                        .user(user)
                        .amount(amount2)
                        .paymentMethod("CREDIT_CARD")
                        .transactionId(UUID.randomUUID().toString())
                        .status("SUCCESS")
                        .createdAt(LocalDateTime.now().minusDays(5))
                        .build();
                paymentRepository.save(p2);

                String deliveredNote = switch(user.getEmail()) {
                    case "admin@gmail.com" -> "Çocuk esirgeme kurumundaki etkinlik için bağışlıyorum.";
                    case "user@gmail.com" -> "Sokak hayvanları yararına mama ve destek amaçlıdır.";
                    case "staff@gmail.com" -> "Kışlık giyecek yardımı kampanyası kapsamında dağıtılması ricasıyla.";
                    default -> "Katkıda bulunabilmek dileğiyle, teşekkürler.";
                };

                Donation deliveredDonation = Donation.builder()
                        .donor(user)
                        .product(product)
                        .quantity(1)
                        .amount(amount2)
                        .payment(p2)
                        .status(DonationStatus.DELIVERED)
                        .notes(deliveredNote)
                        .beneficiary("Sokak Hayvanları Koruma Derneği")
                        .proofImageUrl("https://images.unsplash.com/photo-1542838132-92c53300491e")
                        .createdAt(LocalDateTime.now().minusDays(5))
                        .deliveredAt(LocalDateTime.now().minusDays(2))
                        .build();
                donationRepository.save(deliveredDonation);
                System.out.println("DEBUG: " + user.getEmail() + " için mock bağışlar eklendi!");
            });
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

    private void seedDonationHubs() {
        donationHubRepository.save(DonationHub.builder()
                .name("Kadıköy İyilik Toplama Merkezi")
                .description("Kıyafet, kitap ve dayanıklı gıda yardımlarınızı kabul ediyoruz. Gönüllü olarak paketleme çalışmalarına katılabilirsiniz.")
                .type("HUB")
                .latitude(40.9900)
                .longitude(29.0250)
                .address("Caferağa Mah. Moda Cad. No: 45, Kadıköy, İstanbul")
                .imageUrl("https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1170&auto=format&fit=crop")
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .build());

        donationHubRepository.save(DonationHub.builder()
                .name("Beşiktaş Sokak Hayvanları Besleme Etkinliği")
                .description("Sokak dostlarımız için mama dağıtımı ve kulübe yapımı faaliyeti. Barınak desteği için gönüllüler aranıyor.")
                .type("EVENT")
                .latitude(41.0420)
                .longitude(29.0080)
                .address("Abbasağa Parkı İçi, Beşiktaş, İstanbul")
                .imageUrl("https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1169&auto=format&fit=crop")
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .build());

        donationHubRepository.save(DonationHub.builder()
                .name("Ataşehir Sokak Hayvanları Geçici Barınağı")
                .description("Sokaktan kurtarılan dostlarımızın bakım, tedavi ve sahiplendirme merkezi.")
                .type("SHELTER")
                .latitude(40.9850)
                .longitude(29.1100)
                .address("Barbaros Mah. Mor Sümbül Sok. No: 12, Ataşehir, İstanbul")
                .imageUrl("https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1169&auto=format&fit=crop")
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .build());

        donationHubRepository.save(DonationHub.builder()
                .name("Şişli Çocuk Destek Deposu")
                .description("Çocuklar için kırtasiye, oyuncak ve giysi yardımlarının ayrıştırılarak köy okullarına gönderildiği merkez.")
                .type("HUB")
                .latitude(41.0600)
                .longitude(28.9870)
                .address("Halaskargazi Cad. No: 110, Şişli, İstanbul")
                .imageUrl("https://images.unsplash.com/photo-1452860606245-08befc0ff44b?q=80&w=1170&auto=format&fit=crop")
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .build());

        System.out.println("DEBUG: 4 adet mock DonationHub başarıyla oluşturuldu!");
    }
}
