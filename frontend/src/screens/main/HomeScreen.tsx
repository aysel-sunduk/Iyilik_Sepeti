import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import { addToCart } from '../../redux/slices/cartSlice';
import { RootState } from '../../redux/store';

const categories = [
  { id: 1, name: 'Elektronik', icon: '📱', color: '#10B981' },
  { id: 2, name: 'Giyim', icon: '👕', color: '#3B82F6' },
  { id: 3, name: 'Gıda', icon: '🍎', color: '#F59E0B' },
  { id: 4, name: 'Kozmetik', icon: '💄', color: '#EC4899' },
  { id: 5, name: 'Oyuncak', icon: '🎮', color: '#8B5CF6' },
  { id: 6, name: 'Kitap', icon: '📚', color: '#EF4444' },
  { id: 7, name: 'Mama', icon: '🐕', color: '#F97316' },
];

const popularProducts = [
  { id: 1, name: 'iPhone 15', price: 45000, image: '📱', seller: 'Apple Store', category: 'Elektronik' },
  { id: 2, name: 'Kazak', price: 450, image: '👕', seller: 'LCW', category: 'Giyim' },
  { id: 3, name: 'Gıda Kolisi', price: 350, image: '🍲', seller: 'A101', category: 'Gıda' },
  { id: 4, name: 'Mama 15kg', price: 299, image: '🐕', seller: 'PetShop', category: 'Mama' },
  { id: 5, name: 'Bot', price: 899, image: '👢', seller: 'Kinetix', category: 'Giyim' },
  { id: 6, name: 'Powerbank', price: 199, image: '🔋', seller: 'Xiaomi', category: 'Elektronik' },
];

const donationCampaigns = [
  { id: 1, productName: 'Okul Çantası', target: 500, raised: 320, unit: 'adet', image: '🎒', price: 150 },
  { id: 2, productName: 'Battaniye', target: 1000, raised: 740, unit: 'adet', image: '🛏️', price: 89 },
  { id: 3, productName: 'Kuru Mama', target: 2000, raised: 1250, unit: 'kg', image: '🐕', price: 45 },
];

export default function HomeScreen({ navigation }: any) {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [searchText, setSearchText] = useState('');

  const handleBuyForSelf = (product: any) => {
    dispatch(addToCart({ ...product, quantity: 1, type: 'self' }));
    Alert.alert('Başarılı', `${product.name} sepete eklendi!`, [
      { text: 'Alışverişe Devam Et', style: 'cancel' },
      { text: 'Sepete Git', onPress: () => navigation.navigate('Cart') }
    ]);
  };

  const handleDonate = (product: any) => {
    navigation.navigate('DonationFlow', { product: { ...product, isDonation: true } });
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.greeting, { color: theme.text3 }]}>Merhaba 👋</Text>
              <Text style={[styles.userName, { color: theme.text1 }]}>{user?.firstName || 'Misafir'}!</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
              <View style={styles.cartIcon}>
                <Text style={{ fontSize: 24 }}>🛒</Text>
                {cartItemCount > 0 && (
                  <View style={[styles.cartBadge, { backgroundColor: theme.accent }]}>
                    <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>

          <View style={[styles.searchBar, { backgroundColor: theme.bg, borderColor: theme.border }]}>
            <Text style={{ fontSize: 16 }}>🔍</Text>
            <TextInput
              style={[styles.searchInput, { color: theme.text1 }]}
              placeholder="Ürün, kategori veya marka ara..."
              placeholderTextColor={theme.text4}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.campaignBanner, { backgroundColor: theme.accentLight }]}
          onPress={() => navigation.navigate('DonationCampaigns')}
        >
          <Text style={styles.campaignBannerEmoji}>🌱</Text>
          <View style={styles.campaignBannerText}>
            <Text style={[styles.campaignBannerTitle, { color: theme.accentDark }]}>Her alışveriş bir iyilik</Text>
            <Text style={[styles.campaignBannerSub, { color: theme.text3 }]}>Bugün al, yarın bir cana umut ol</Text>
          </View>
        </TouchableOpacity>

        {/* Hızlı Aksiyon Butonları */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={[styles.quickActionBtn, { backgroundColor: theme.surface }]} onPress={() => navigation.navigate('Categories')}>
            <Text style={styles.quickActionEmoji}>🛍️</Text>
            <Text style={[styles.quickActionText, { color: theme.text2 }]}>Hızlı Alışveriş</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickActionBtn, { backgroundColor: theme.surface }]} onPress={() => navigation.navigate('DonationCampaigns')}>
            <Text style={styles.quickActionEmoji}>🎁</Text>
            <Text style={[styles.quickActionText, { color: theme.text2 }]}>Hızlı Bağış</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickActionBtn, { backgroundColor: theme.surface }]} onPress={() => navigation.navigate('DonationTracking')}>
            <Text style={styles.quickActionEmoji}>📦</Text>
            <Text style={[styles.quickActionText, { color: theme.text2 }]}>Bağışlarım</Text>
          </TouchableOpacity>
        </View>

        {/* Bugünün Bağış Hedefi */}
        <View style={[styles.dailyGoal, { backgroundColor: theme.accentLight }]}>
          <Text style={styles.dailyGoalEmoji}>🎯</Text>
          <View style={styles.dailyGoalContent}>
            <Text style={[styles.dailyGoalTitle, { color: theme.text1 }]}>Bugünkü Bağış Hedefi</Text>
            <Text style={[styles.dailyGoalText, { color: theme.text3 }]}>2.000 mama / 1.250 tamamlandı</Text>
            <View style={styles.dailyGoalProgress}>
              <View style={[styles.dailyGoalFill, { width: '62%', backgroundColor: theme.accent }]} />
            </View>
          </View>
        </View>

        {/* Kategoriler */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text1 }]}>Kategoriler</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
              <Text style={[styles.sectionLink, { color: theme.accent }]}>Tümü →</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingLeft: 20 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.categoryCard, { backgroundColor: theme.surface }]}
                onPress={() => navigation.navigate('Categories', { selectedCategory: item.name })}
              >
                <View style={[styles.categoryIcon, { backgroundColor: item.color + '20' }]}>
                  <Text style={{ fontSize: 32 }}>{item.icon}</Text>
                </View>
                <Text style={[styles.categoryName, { color: theme.text2 }]}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Popüler Ürünler - Ticaret */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text1 }]}>🔥 Popüler Ürünler</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AllProducts')}>
              <Text style={[styles.sectionLink, { color: theme.accent }]}>Tümü →</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={popularProducts}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingLeft: 20 }}
            renderItem={({ item }) => (
              <View style={[styles.productCardWrapper, { backgroundColor: theme.surface }]}>
                <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { product: item })}>
                  <View style={styles.productImage}>
                    <Text style={{ fontSize: 48 }}>{item.image}</Text>
                  </View>
                  <Text style={[styles.productName, { color: theme.text1 }]}>{item.name}</Text>
                  <Text style={[styles.productPrice, { color: theme.accent }]}>₺{item.price.toLocaleString()}</Text>
                  <Text style={[styles.productSeller, { color: theme.text4 }]}>{item.seller}</Text>
                </TouchableOpacity>
                <View style={styles.productActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.accentLight }]}
                    onPress={() => handleBuyForSelf(item)}
                  >
                    <Text style={styles.actionButtonText}>🛍️ Kendine Al</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.accentXl }]}
                    onPress={() => handleDonate(item)}
                  >
                    <Text style={[styles.actionButtonText, { color: theme.accent }]}>🎁 Bağış Yap</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>

        {/* Bağış Kampanyaları */}
        <View style={[styles.section, styles.donationSection]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text1 }]}>🎁 Bağış Bekleyen Ürünler</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AllDonationCampaigns')}>
              <Text style={[styles.sectionLink, { color: theme.accent }]}>Tümü →</Text>
            </TouchableOpacity>
          </View>
          {donationCampaigns.map((campaign) => (
            <View key={campaign.id} style={[styles.donationCard, { backgroundColor: theme.accentXl }]}>
              <View style={styles.donationCardLeft}>
                <Text style={{ fontSize: 48 }}>{campaign.image}</Text>
              </View>
              <View style={styles.donationCardRight}>
                <Text style={[styles.donationTitle, { color: theme.text1 }]}>{campaign.productName}</Text>
                <Text style={[styles.donationPrice, { color: theme.accent }]}>₺{campaign.price}</Text>
                <View style={styles.donationProgress}>
                  <View style={[styles.donationProgressFill, { width: `${(campaign.raised / campaign.target) * 100}%`, backgroundColor: theme.accent }]} />
                </View>
                <View style={styles.donationStats}>
                  <Text style={[styles.donationText, { color: theme.text3 }]}>
                    {campaign.raised} / {campaign.target} {campaign.unit}
                  </Text>
                  <TouchableOpacity
                    style={[styles.donateButton, { backgroundColor: theme.accent }]}
                    onPress={() => handleDonate({ name: campaign.productName, price: campaign.price, image: campaign.image, isCampaign: true, campaignId: campaign.id })}
                  >
                    <Text style={styles.donateButtonText}>Bağış Yap →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { backgroundColor: theme.surface, borderTopColor: theme.border, borderTopWidth: 1 }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.replace('Home')}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={[styles.navLabel, { color: theme.accent }]}>Ana Sayfa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Categories')}>
          <Text style={styles.navIcon}>📂</Text>
          <Text style={[styles.navLabel, { color: theme.text4 }]}>Kategoriler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Cart')}>
          <Text style={styles.navIcon}>🛒</Text>
          <Text style={[styles.navLabel, { color: theme.text4 }]}>Sepetim</Text>
          {cartItemCount > 0 && (
            <View style={[styles.navBadge, { backgroundColor: theme.accent }]}>
              <Text style={styles.navBadgeText}>{cartItemCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('DonationTracking')}>
          <Text style={styles.navIcon}>🎁</Text>
          <Text style={[styles.navLabel, { color: theme.text4 }]}>Bağışlarım</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={[styles.navLabel, { color: theme.text4 }]}>Profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20, borderBottomWidth: 1 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  greeting: { fontSize: 14, marginBottom: 4 },
  userName: { fontSize: 20, fontWeight: 'bold' },
  cartIcon: { position: 'relative' },
  cartBadge: { position: 'absolute', top: -8, right: -12, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, minWidth: 20, alignItems: 'center' },
  cartBadgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, gap: 10 },
  searchInput: { flex: 1, fontSize: 16 },
  campaignBanner: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginVertical: 16, padding: 16, borderRadius: 20 },
  campaignBannerEmoji: { fontSize: 32, marginRight: 12 },
  campaignBannerText: { flex: 1 },
  campaignBannerTitle: { fontSize: 16, fontWeight: 'bold' },
  campaignBannerSub: { fontSize: 13, marginTop: 4 },
  quickActions: { flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 20, marginBottom: 16, gap: 12 },
  quickActionBtn: { flex: 1, padding: 14, borderRadius: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  quickActionEmoji: { fontSize: 20 },
  quickActionText: { fontSize: 13, fontWeight: '500' },
  dailyGoal: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 24, padding: 16, borderRadius: 20 },
  dailyGoalEmoji: { fontSize: 28, marginRight: 12 },
  dailyGoalContent: { flex: 1 },
  dailyGoalTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  dailyGoalText: { fontSize: 12, marginBottom: 8 },
  dailyGoalProgress: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden' },
  dailyGoalFill: { height: '100%', borderRadius: 4 },
  section: { marginTop: 24, marginBottom: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  sectionLink: { fontSize: 14 },
  categoryCard: { alignItems: 'center', marginRight: 16, padding: 12, borderRadius: 16, width: 80 },
  categoryIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  categoryName: { fontSize: 12, textAlign: 'center' },
  productCardWrapper: { marginRight: 16, padding: 12, borderRadius: 16, width: 180 },
  productImage: { width: '100%', height: 120, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  productName: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  productPrice: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  productSeller: { fontSize: 11 },
  productActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, gap: 8 },
  actionButton: { flex: 1, paddingVertical: 8, borderRadius: 20, alignItems: 'center' },
  actionButtonText: { fontSize: 11, fontWeight: '600' },
  donationSection: { marginBottom: 80 },
  donationCard: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 12, padding: 16, borderRadius: 16 },
  donationCardLeft: { marginRight: 16, justifyContent: 'center' },
  donationCardRight: { flex: 1 },
  donationTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  donationPrice: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  donationProgress: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  donationProgressFill: { height: '100%', borderRadius: 4 },
  donationStats: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  donationText: { fontSize: 12 },
  donateButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  donateButtonText: { color: 'white', fontSize: 12, fontWeight: '600' },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 12, position: 'absolute', bottom: 0, left: 0, right: 0 },
  navItem: { alignItems: 'center', position: 'relative' },
  navIcon: { fontSize: 24, marginBottom: 4 },
  navLabel: { fontSize: 11 },
  navBadge: { position: 'absolute', top: -6, right: -12, borderRadius: 10, paddingHorizontal: 5, paddingVertical: 1, minWidth: 18, alignItems: 'center' },
  navBadgeText: { color: 'white', fontSize: 9, fontWeight: 'bold' },
});