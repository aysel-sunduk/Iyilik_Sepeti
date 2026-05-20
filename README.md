# 🛒💚 İyilik Sepeti

**İyilik Sepeti**, e-ticaret ve sosyal sorumluluk/bağış konseptlerini birleştiren hibrit bir mobil uygulamadır. Kullanıcılar hem kendileri için alışveriş yapabilir hem de ihtiyaç sahiplerine bağışta bulunabilir.

---

## 📋 Proje Hakkında

İyilik Sepeti, kullanıcıların günlük alışveriş deneyimlerini sosyal fayda ile birleştirmelerini sağlar. Platform üzerinden ürün satın alabilir, bağış kampanyalarına destek olabilir, kargo takibi yapabilir ve yakınındaki bağış noktalarını keşfedebilirsiniz.

**Proje Türü:** BTK Staj Projesi  
**Geliştirme Dönemi:** 2026

---

## 🏗️ Teknoloji Yığını

### Backend
| Teknoloji | Açıklama |
|-----------|----------|
| **Java 17** | Ana programlama dili |
| **Spring Boot 3** | Web framework |
| **Spring Security + JWT** | Kimlik doğrulama ve yetkilendirme |
| **Spring Data JPA** | Veritabanı erişim katmanı |
| **H2 Database** | Geliştirme ortamı veritabanı |
| **Lombok** | Boilerplate kod azaltma |
| **Swagger / OpenAPI** | API dokümantasyonu |

### Frontend (Mobil)
| Teknoloji | Açıklama |
|-----------|----------|
| **React Native 0.85** | Çapraz platform mobil geliştirme |
| **TypeScript** | Tip güvenli JavaScript |
| **Redux Toolkit** | Durum yönetimi |
| **React Navigation 7** | Ekran navigasyonu |
| **Axios** | HTTP istemci |
| **React Native Reanimated** | Animasyonlar |

---

## 📁 Proje Yapısı

```
Iyilik_Sepeti/
├── backend/                          # Spring Boot Backend
│   ├── src/main/java/com/donatecommerce/
│   │   ├── config/                   # Uygulama yapılandırmaları
│   │   ├── controller/               # REST API Controller'ları
│   │   ├── dto/                      # Data Transfer Object'ler
│   │   ├── entity/                   # JPA Entity sınıfları
│   │   ├── exception/                # Özel hata sınıfları
│   │   ├── mapper/                   # DTO-Entity dönüştürücüler
│   │   ├── repository/               # JPA Repository'ler
│   │   ├── scheduler/                # Zamanlanmış görevler
│   │   ├── security/                 # JWT ve güvenlik yapılandırması
│   │   ├── service/                  # İş mantığı servisleri
│   │   └── util/                     # Yardımcı sınıflar
│   └── pom.xml
│
├── frontend/                         # React Native Mobil Uygulama
│   ├── src/
│   │   ├── assets/                   # Logo ve görseller
│   │   ├── components/               # Yeniden kullanılabilir bileşenler
│   │   ├── context/                  # React Context (Theme, Auth)
│   │   ├── hooks/                    # Özel React Hook'ları
│   │   ├── navigation/               # Ekran yönlendirme yapısı
│   │   ├── redux/                    # Redux store ve slice'lar
│   │   ├── screens/                  # Uygulama ekranları
│   │   │   ├── auth/                 # Giriş ve Kayıt ekranları
│   │   │   ├── main/                 # Ana kullanıcı ekranları
│   │   │   └── admin/                # Yönetim paneli ekranları
│   │   ├── services/                 # API servisleri
│   │   ├── styles/                   # Tema ve stil dosyaları
│   │   └── utils/                    # Yardımcı fonksiyonlar
│   └── package.json
│
└── README.md
```

---

## ✨ Özellikler

### 👤 Kullanıcı Tarafı
- **Kayıt / Giriş:** JWT tabanlı güvenli kimlik doğrulama
- **Ana Sayfa:** Kategoriler, kampanyalar, popüler ürünler
- **Ürün Detay:** Ürün bilgileri ve sepete ekleme
- **Sepet & Ödeme:** Cüzdan veya kredi kartıyla ödeme
- **Cüzdan Bakiye Yükleme:** Kayıtlı karttan cüzdana bakiye yükleme
- **Sipariş Takibi:** Güzergah üzerinde kargo konumu ve tahmini teslimat
- **Bağış Akışı:** Bağış kampanyalarına katılma ve takip
- **Yakınımdaki Bağış Noktaları:** Harita tabanlı bağış merkezlerini görme
- **Profil Yönetimi:** Adres, kart ve kişisel bilgi yönetimi
- **Tema Desteği:** Açık / Koyu / Sistem teması

### 🔧 Admin Paneli
- **Dashboard:** Genel istatistikler ve özet bilgiler
- **Ürün Yönetimi:** Ürün ekleme, düzenleme, silme
- **Kategori Yönetimi:** Kategori ekleme ve düzenleme
- **Sipariş Yönetimi:** Siparişleri onaylama, kargolama, iptal
- **Kampanya Yönetimi:** Bağış kampanyası oluşturma ve düzenleme
- **Bağış Doğrulama:** Gelen bağışları onaylama

---

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Java 17+
- Node.js 22+
- Android Studio (emülatör için)
- Maven

### Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend varsayılan olarak `http://localhost:8080` adresinde çalışır.

### Frontend

```bash
cd frontend
npm install
npm start          # Metro Bundler'ı başlat
npm run android    # Android emülatörde çalıştır
```

> **Not:** Emülatörden backend'e bağlanmak için API URL'si `10.0.2.2:8080` olarak ayarlanmıştır (Android emülatör localhost proxy).

---

## 📡 API Dokümantasyonu

Backend çalışırken Swagger UI'a şu adresten erişebilirsiniz:

```
http://localhost:8080/swagger-ui.html
```

### Temel API Endpoint'leri

| Metod | Endpoint | Açıklama |
|-------|----------|----------|
| POST | `/api/auth/register` | Kullanıcı kaydı |
| POST | `/api/auth/login` | Kullanıcı girişi |
| GET | `/api/users/me` | Kullanıcı profili |
| POST | `/api/users/wallet/topup` | Cüzdana bakiye yükleme |
| GET | `/api/products` | Ürün listesi |
| GET | `/api/categories` | Kategori listesi |
| POST | `/api/orders` | Sipariş oluşturma |
| GET | `/api/orders/my` | Kullanıcının siparişleri |
| GET | `/api/campaigns` | Bağış kampanyaları |
| GET | `/api/donation-hubs` | Yakındaki bağış noktaları |
