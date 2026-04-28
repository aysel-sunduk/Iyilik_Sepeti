package com.donatecommerce.service;

import com.donatecommerce.entity.Category;
import com.donatecommerce.entity.Product;
import com.donatecommerce.repository.CategoryRepository;
import com.donatecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebScraperService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    private static final String USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

    public List<Product> scrapeN11(String keyword, int maxProducts) {
        List<Product> scrapedProducts = new ArrayList<>();
        try {
            String url = "https://www.n11.com/arama?q=" + keyword;
            Document doc = Jsoup.connect(url).userAgent(USER_AGENT).timeout(20000).get();
            Elements products = doc.select(".columnContent, .pro");
            int count = 0;
            for (Element el : products) {
                if (count >= maxProducts) break;
                String name = el.select(".productName").text();
                String priceText = el.select(".newPrice, .insPrice").text();
                if (priceText.isEmpty()) continue;
                
                String imageUrl = el.select("img").attr("data-original");
                if (imageUrl.isEmpty()) imageUrl = el.select("img").attr("src");
                
                priceText = priceText.replaceAll("[^0-9,]", "").replace(",", ".").trim();
                saveProduct(name, new BigDecimal(priceText), imageUrl, "elektronik", scrapedProducts);
                count++;
            }
        } catch (Exception e) { log.error("N11 failed: {}", e.getMessage()); }
        return scrapedProducts;
    }

    public List<Product> scrapeHepsiburada(String keyword, int maxProducts) {
        List<Product> scrapedProducts = new ArrayList<>();
        try {
            String url = "https://www.hepsiburada.com/ara?q=" + keyword;
            Document doc = Jsoup.connect(url).userAgent(USER_AGENT).referrer("https://www.google.com").timeout(20000).get();
            Elements products = doc.select("[data-test-id='product-card-container']");
            int count = 0;
            for (Element el : products) {
                if (count >= maxProducts) break;
                String name = el.select("[data-test-id='product-card-name']").text();
                String priceText = el.select("[data-test-id='price-current-price']").text();
                if (priceText.isEmpty()) continue;
                
                String imageUrl = el.select("img").attr("src");
                priceText = priceText.replaceAll("[^0-9,]", "").replace(",", ".").trim();
                saveProduct(name, new BigDecimal(priceText), imageUrl, "genel", scrapedProducts);
                count++;
            }
        } catch (Exception e) { log.error("Hepsiburada failed: {}", e.getMessage()); }
        return scrapedProducts;
    }

    public List<Product> scrapeHappyCenter(String category, int maxProducts) {
        List<Product> scrapedProducts = new ArrayList<>();
        try {
            String url = "https://www.happycenter.com.tr/" + category;
            Document doc = Jsoup.connect(url).userAgent(USER_AGENT).timeout(20000).get();
            Elements products = doc.select(".product-item");
            int count = 0;
            for (Element el : products) {
                if (count >= maxProducts) break;
                String name = el.select(".product-name").text();
                String priceText = el.select(".price").text();
                if (priceText.isEmpty()) continue;
                
                String imageUrl = el.select("img").attr("data-src");
                if (imageUrl.isEmpty()) imageUrl = el.select("img").attr("src");
                
                priceText = priceText.replaceAll("[^0-9,]", "").replace(",", ".").trim();
                saveProduct(name, new BigDecimal(priceText), imageUrl, "gıda", scrapedProducts);
                count++;
            }
        } catch (Exception e) { log.error("HappyCenter failed: {}", e.getMessage()); }
        return scrapedProducts;
    }

    public List<Product> scrapeOnurMarket(String category, int maxProducts) {
        List<Product> scrapedProducts = new ArrayList<>();
        try {
            String url = "https://www.onurmarket.com/" + category;
            Document doc = Jsoup.connect(url).userAgent(USER_AGENT).timeout(20000).get();
            Elements products = doc.select(".product-item");
            int count = 0;
            for (Element el : products) {
                if (count >= maxProducts) break;
                String name = el.select(".name").text();
                String priceText = el.select(".price").text();
                if (priceText.isEmpty()) continue;
                
                String imageUrl = el.select(".product-image img").attr("src");
                priceText = priceText.replaceAll("[^0-9,]", "").replace(",", ".").trim();
                saveProduct(name, new BigDecimal(priceText), imageUrl, "temel ihtiyaç", scrapedProducts);
                count++;
            }
        } catch (Exception e) { log.error("OnurMarket failed: {}", e.getMessage()); }
        return scrapedProducts;
    }

    public List<Product> scrapeCivil(String category, int maxProducts) {
        List<Product> scrapedProducts = new ArrayList<>();
        try {
            String url = "https://www.civilim.com/" + category;
            Document doc = Jsoup.connect(url).userAgent(USER_AGENT).timeout(20000).get();
            Elements products = doc.select(".productItem");
            int count = 0;
            for (Element el : products) {
                if (count >= maxProducts) break;
                String name = el.select(".productName").text();
                String priceText = el.select(".discountPrice, .regularPrice").text();
                if (priceText.isEmpty()) continue;
                
                String imageUrl = el.select(".productImage img").attr("data-src");
                if (imageUrl.isEmpty()) imageUrl = el.select(".productImage img").attr("src");
                
                priceText = priceText.replaceAll("[^0-9,]", "").replace(",", ".").trim();
                saveProduct(name, new BigDecimal(priceText), imageUrl, "bebek", scrapedProducts);
                count++;
            }
        } catch (Exception e) { log.error("Civil failed: {}", e.getMessage()); }
        return scrapedProducts;
    }

    private void saveProduct(String name, BigDecimal price, String imageUrl, String categoryName, List<Product> list) {
        if (!productRepository.existsByName(name)) {
            Product p = new Product();
            p.setName(name);
            p.setPrice(price);
            p.setImageUrl(imageUrl);
            p.setCategory(categoryName);
            p.setIsActive(true);
            p.setStockQuantity(100);
            p.setCreatedAt(LocalDateTime.now());
            list.add(productRepository.save(p));
            log.info("Saved product: {}", name);
        }
    }

    private Category getOrCreateCategory(String categoryName) {
        return categoryRepository.findByNameIgnoreCase(categoryName)
                .orElseGet(() -> {
                    Category cat = new Category();
                    cat.setName(categoryName.toLowerCase());
                    cat.setIsActive(true);
                    cat.setCreatedAt(LocalDateTime.now());
                    return categoryRepository.save(cat);
                });
    }
}