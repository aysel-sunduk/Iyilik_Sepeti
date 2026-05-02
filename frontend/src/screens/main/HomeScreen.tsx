import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Dimensions,
  Alert
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { RootState } from '../../redux/store';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api/api';
import { CategoryResponse as Category, ProductResponse as Product, CampaignResponse as Campaign } from '../../services/api/types';
import { Modal } from 'react-native';


const LogoutIcon = ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M17 16L21 12L17 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M21 12H9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export default function HomeScreen({ navigation }: any) {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { logout } = useAuth();
  const user = useSelector((state: RootState) => state.auth.user);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  
  const [activeFilter, setActiveFilter] = useState('Hepsi');
  const [searchText, setSearchText] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  // Custom Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', icon: '' });

  const showAlert = (title: string, message: string, icon: string = '✨') => {
    setModalContent({ title, message, icon });
    setModalVisible(true);
  };

  const categoryConfigs: any = {
    'gıda': { icon: '🍎', color: '#EF4444' },
    'giyim': { icon: '👕', color: '#3B82F6' },
    'hijyen': { icon: '✨', color: '#10B981' },
    'çocuk': { icon: '🧸', color: '#F472B6' },
    'hayvan': { icon: '🐾', color: '#FB923C' },
    'hayvan hakları': { icon: '🐾', color: '#FB923C' },
    'eğitim': { icon: '📚', color: '#3B82F6' },
    'temizlik': { icon: '🧼', color: '#3B82F6' },
    'default': { icon: '📦', color: '#6B7280' }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [activeFilter, popularProducts]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesData, productsData, campaignsData] = await Promise.all([
        api.categories.getAll(),
        api.products.getAll(),
        api.campaigns.getAll()
      ]);
      setCategories(categoriesData);
      setPopularProducts(productsData.slice(0, 6)); // Öne çıkanlar için ilk 6'yı al
      setCampaigns(campaignsData);
    } catch (error: any) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let result = [...popularProducts];
    if (activeFilter === 'İndirimdekiler') {
      result = popularProducts.filter(p => p.price < 300);
    } else if (activeFilter === 'Bağış Ürünleri') {
      result = popularProducts.filter(p => p.category.toLowerCase().includes('hayvan') || p.category.toLowerCase().includes('çocuk'));
    } else if (activeFilter === 'Popüler') {
      result = popularProducts.filter(p => p.price > 400);
    } else if (activeFilter === 'Yeni') {
      result = popularProducts.slice(0, 3);
    }
    setFilteredProducts(result);
  };

  const handleLogout = () => {
    showAlert('Çıkış', 'Oturumu kapatmak istediğinize emin misiniz?', '🚪');
  };

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({ 
      id: product.id, 
      name: product.name, 
      price: product.price, 
      image: product.imageUrl || '📦', 
      seller: product.category,
      quantity: 1, 
      type: 'self' 
    }));
    showAlert('Başarılı', `${product.name} sepete eklendi!`, '🛒');
  };

  const handleDonateProduct = (product: Product) => {
    navigation.navigate('DonationFlow', { 
      product: { 
        ...product, 
        image: product.imageUrl || '📦',
        seller: product.category,
        isDonation: true 
      } 
    });
  };

  const handleDonateCampaign = (campaign: Campaign) => {
    navigation.navigate('DonationFlow', { 
      campaign: campaign,
      isCampaign: true 
    });
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
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <TouchableOpacity onPress={handleLogout} style={{ padding: 4 }}>
                <LogoutIcon color={theme.accent} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Sepetim')}>
                <View style={styles.cartIcon}>
                  <Text style={{ fontSize: 24 }}>🛒</Text>
                  {cartItemCount > 0 && (
                    <View style={[styles.badge, { backgroundColor: theme.error }]}>
                      <Text style={styles.badgeText}>{cartItemCount}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={[styles.searchBar, { backgroundColor: theme.bg, borderColor: theme.border }]}>
            <Text style={{ fontSize: 20, marginRight: 10 }}>🔍</Text>
            <TextInput
              placeholder="Ürün veya kategori ara..."
              placeholderTextColor={theme.text3}
              style={[styles.searchInput, { color: theme.text1 }]}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        <View style={styles.content}>
          {/* Hızlı Filtreleme Chip'leri */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer} contentContainerStyle={styles.filtersContent}>
            {['Hepsi', 'Bağış Ürünleri', 'İndirimdekiler', 'Popüler', 'Yeni'].map((filter, index) => (
              <TouchableOpacity 
                key={index} 
                onPress={() => setActiveFilter(filter)}
                style={[
                  styles.filterChip, 
                  activeFilter === filter ? { backgroundColor: theme.accent } : { backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }
                ]}
              >
                <Text style={[styles.filterText, activeFilter === filter ? { color: 'white' } : { color: theme.text2 }]}>{filter}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* İyilik Hikayeleri (Stories) */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesContainer} contentContainerStyle={styles.storiesContent}>
            <TouchableOpacity style={styles.storyItem} onPress={() => showAlert('Canlı Yayın', 'Şu an aktif bir yayın bulunmamaktadır.', '🎬')}>
              <View style={[styles.storyCircle, { borderColor: '#10B981' }]}>
                <View style={[styles.storyInner, { backgroundColor: theme.isDark ? theme.bg : '#F3F4F6' }]}><Text style={{fontSize: 24}}>🎬</Text></View>
              </View>
              <Text style={[styles.storyText, { color: theme.text2 }]}>Canlı</Text>
            </TouchableOpacity>
            {['Mama Dağıtımı', 'Yeni Okul', 'Sokak Dostları', 'Duyuru'].map((story, index) => (
              <TouchableOpacity key={index} style={styles.storyItem} onPress={() => showAlert('Hikaye', `${story} videosu yükleniyor...`, ['🐕', '🎒', '🦴', '📢'][index])}>
                <View style={[styles.storyCircle, { borderColor: theme.accent }]}>
                  <View style={[styles.storyInner, { backgroundColor: theme.isDark ? theme.bg : '#F3F4F6' }]}><Text style={{fontSize: 24}}>{['🐕', '🎒', '🦴', '📢'][index]}</Text></View>
                </View>
                <Text style={[styles.storyText, { color: theme.text2 }]} numberOfLines={1}>{story}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Main Hero Banner */}
          <View style={[styles.heroBanner, { backgroundColor: theme.isDark ? theme.surface : '#F3F4F6', borderColor: theme.border }]}>
            <View style={styles.heroContent}>
              <Text style={[styles.heroTitle, { color: theme.text1 }]}>Yeni Sezon Ürünler 🌟</Text>
              <Text style={[styles.heroSubtitle, { color: theme.text2 }]}>En kaliteli ürünler, en uygun fiyatlarla kapında.</Text>
              <TouchableOpacity style={[styles.heroButton, { backgroundColor: theme.accent }]} onPress={() => navigation.navigate('Kategoriler')}>
                <Text style={[styles.heroButtonText, { color: 'white' }]}>Koleksiyonu İncele</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Access */}
          <View style={styles.quickAccess}>
            <TouchableOpacity style={styles.quickItem} onPress={() => navigation.navigate('Kategoriler')}>
              <View style={[styles.quickIcon, { backgroundColor: '#3B82F615' }]}><Text style={{fontSize: 24}}>⚡</Text></View>
              <Text style={[styles.quickText, { color: theme.text2 }]}>Flaş İndirim</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickItem} onPress={() => navigation.navigate('Sepetim')}>
              <View style={[styles.quickIcon, { backgroundColor: '#10B98115' }]}><Text style={{fontSize: 24}}>🤝</Text></View>
              <Text style={[styles.quickText, { color: theme.text2 }]}>Bağışla</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickItem} onPress={() => navigation.navigate('Kategoriler')}>
              <View style={[styles.quickIcon, { backgroundColor: '#F59E0B15' }]}><Text style={{fontSize: 24}}>⭐</Text></View>
              <Text style={[styles.quickText, { color: theme.text2 }]}>Popüler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickItem} onPress={() => navigation.navigate('Kategoriler')}>
              <View style={[styles.quickIcon, { backgroundColor: '#EC489915' }]}><Text style={{fontSize: 24}}>📍</Text></View>
              <Text style={[styles.quickText, { color: theme.text2 }]}>Yakınımda</Text>
            </TouchableOpacity>
          </View>

          {/* Categories Section */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text1 }]}>Kategoriler</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Kategoriler')}>
              <Text style={[styles.seeAll, { color: theme.accent }]}>Tümü →</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
            {categories.map((category) => {
              const config = categoryConfigs[category.name.toLowerCase()] || categoryConfigs['default'];
              return (
                <TouchableOpacity 
                  key={category.id} 
                  style={styles.categoryItem}
                  onPress={() => navigation.navigate('Kategoriler', { categoryName: category.name })}
                >
                  <View style={[styles.categoryIconContainer, { backgroundColor: config.color + '15' }]}>
                    <Text style={styles.categoryIcon}>{config.icon}</Text>
                  </View>
                  <Text style={[styles.categoryName, { color: theme.text2 }]} numberOfLines={1}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Popular Products Section */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text1 }]}>🔥 Öne Çıkan Ürünler</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Kategoriler')}>
              <Text style={[styles.seeAll, { color: theme.accent }]}>Tümü →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.productsGrid}>
            {filteredProducts.map((product) => (
              <TouchableOpacity 
                key={product.id} 
                style={[styles.productCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                onPress={() => navigation.navigate('ProductDetail', { product })}
              >
                <View style={[styles.productImageContainer, { backgroundColor: theme.bg }]}>
                   <Text style={{ fontSize: 40 }}>{categoryConfigs[product.category.toLowerCase()]?.icon || '📦'}</Text>
                </View>
                <View style={styles.productInfo}>
                  <Text style={[styles.productName, { color: theme.text1 }]} numberOfLines={1}>{product.name}</Text>
                  <Text style={[styles.productPrice, { color: theme.accent }]}>{product.price.toLocaleString('tr-TR')} ₺</Text>
                  <View style={styles.productActions}>
                    <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#3B82F6' }]} onPress={() => handleAddToCart(product)}>
                      <Text style={[styles.actionButtonText, { color: 'white' }]}>Sepet</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#10B981' }]} onPress={() => handleDonateProduct(product)}>
                      <Text style={[styles.actionButtonText, { color: 'white' }]}>Bağış</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Campaigns Section */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text1 }]}>🙏 BAĞIŞ KAMPANYALARI</Text>
          </View>
          {campaigns.map((campaign) => (
            <View 
              key={campaign.id} 
              style={[styles.campaignCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
              <View style={styles.campaignHeader}>
                <View style={[styles.campaignImage, { backgroundColor: theme.bg }]}>
                  <Text style={{ fontSize: 30 }}>{campaign.title.includes('Hayvan') ? '🐾' : '🎒'}</Text>
                </View>
                <View style={styles.campaignInfo}>
                  <Text style={[styles.campaignTitle, { color: theme.text1 }]}>{campaign.title}</Text>
                  <Text style={[styles.campaignProgressText, { color: theme.text3 }]}>
                    {campaign.raisedCount} / {campaign.targetCount} {campaign.unit} toplandı
                  </Text>
                </View>
                <TouchableOpacity 
                  style={[styles.donateButton, { backgroundColor: theme.accent }]}
                  onPress={() => handleDonateCampaign(campaign)}
                >
                  <Text style={styles.donateButtonText}>Bağış Yap</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.progressBarContainer, { backgroundColor: theme.bg }]}>
                <View 
                  style={[
                    styles.progressBar, 
                    { 
                      backgroundColor: theme.accent, 
                      width: `${Math.min(100, (campaign.raisedCount / campaign.targetCount) * 100)}%` 
                    }
                  ]} 
                />
              </View>
            </View>
          ))}
          
          <View style={{ height: 20 }} />
        </View>
      </ScrollView>

      {/* Custom Sweet Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <TouchableOpacity 
              style={styles.closeModal} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ fontSize: 20, color: theme.text3 }}>✕</Text>
            </TouchableOpacity>
            <View style={[styles.modalIconContainer, { backgroundColor: theme.accent + '15' }]}>
              <Text style={{ fontSize: 40 }}>{modalContent.icon}</Text>
            </View>
            <Text style={[styles.modalTitle, { color: theme.text1 }]}>{modalContent.title}</Text>
            <Text style={[styles.modalMessage, { color: theme.text2 }]}>{modalContent.message}</Text>
            
            <View style={styles.modalActions}>
              {modalContent.title === 'Çıkış' && (
                <TouchableOpacity 
                  style={[styles.modalButton, { backgroundColor: theme.isDark ? theme.bg : '#F3F4F6' }]} 
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={[styles.closeButtonText, { color: theme.text2 }]}>İptal</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: theme.accent }]} 
                onPress={async () => {
                  setModalVisible(false);
                  if (modalContent.title === 'Çıkış') {
                    await logout();
                  }
                }}
              >
                <Text style={styles.closeButtonText}>{modalContent.title === 'Çıkış' ? 'Çıkış Yap' : 'Tamam'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, paddingTop: 60, borderBottomWidth: 1 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontSize: 16, fontWeight: '500' },
  userName: { fontSize: 22, fontWeight: 'bold' },
  cartIcon: { position: 'relative', padding: 5 },
  badge: { position: 'absolute', top: 0, right: 0, borderRadius: 10, minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5 },
  badgeText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, height: 50, borderRadius: 12, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 16 },
  content: { padding: 20 },
  filtersContainer: { marginBottom: 20 },
  filtersContent: { paddingHorizontal: 0, gap: 10 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  filterText: { fontSize: 13, fontWeight: '600' },
  storiesContainer: { marginBottom: 20 },
  storiesContent: { paddingRight: 20 },
  storyItem: { alignItems: 'center', marginRight: 15, width: 70 },
  storyCircle: { width: 66, height: 66, borderRadius: 33, borderWidth: 2, padding: 3, justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
  storyInner: { width: '100%', height: '100%', borderRadius: 30, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  storyText: { fontSize: 11, fontWeight: '500', textAlign: 'center' },
  heroBanner: { borderRadius: 24, padding: 24, marginBottom: 24, overflow: 'hidden', borderWidth: 1 },
  heroContent: { zIndex: 1 },
  heroTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  heroSubtitle: { fontSize: 14, lineHeight: 20, marginBottom: 16, opacity: 0.9 },
  heroButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, alignSelf: 'flex-start' },
  heroButtonText: { fontSize: 14, fontWeight: 'bold' },
  quickAccess: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  quickItem: { alignItems: 'center' },
  quickIcon: { width: 54, height: 54, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  quickText: { fontSize: 12, fontWeight: '600', textAlign: 'center' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold' },
  seeAll: { fontSize: 14, fontWeight: '600' },
  categoriesContainer: { paddingBottom: 10, marginBottom: 20 },
  categoryItem: { alignItems: 'center', marginRight: 20, width: 80 },
  categoryIconContainer: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 8, elevation: 1 },
  categoryIcon: { fontSize: 32 },
  categoryName: { fontSize: 12, fontWeight: '600', textAlign: 'center' },
  productsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingBottom: 20 },
  productCard: { width: '48%', borderRadius: 20, marginBottom: 16, padding: 10, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, borderWidth: 1 },
  productImageContainer: { width: '100%', height: 140, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  productInfo: { paddingHorizontal: 4 },
  productName: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  productPrice: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  productActions: { flexDirection: 'row', gap: 6 },
  actionButton: { flex: 1, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  actionButtonText: { fontSize: 11, fontWeight: 'bold' },
  campaignCard: { borderRadius: 20, borderWidth: 1, padding: 15, marginBottom: 15 },
  campaignHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  campaignImage: { width: 60, height: 60, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  campaignInfo: { flex: 1 },
  campaignTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  campaignProgressText: { fontSize: 13 },
  donateButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
  donateButtonText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  progressBarContainer: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', borderRadius: 32, padding: 25, alignItems: 'center', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
  modalIconContainer: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  modalMessage: { fontSize: 16, textAlign: 'center', marginBottom: 25, lineHeight: 22 },
  modalActions: { flexDirection: 'row', gap: 10, width: '100%' },
  modalButton: { flex: 1, height: 54, borderRadius: 27, justifyContent: 'center', alignItems: 'center' },
  closeModal: { position: 'absolute', top: 20, right: 20, padding: 5, zIndex: 10 },
  closeButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});