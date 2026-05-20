import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
  SafeAreaView,
  Switch,
  Image,
  Platform,
  ToastAndroid
} from 'react-native';
import Svg, { Path, Circle, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { RootState } from '../../redux/store';
import { resetLoggedIn } from '../../redux/slices/authSlice';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api/api';
import { CategoryResponse as Category, ProductResponse as Product, CampaignResponse as Campaign } from '../../services/api/types';
import { Modal } from 'react-native';

const LogoutIcon = ({ color }: { color: string }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16 17L21 12L16 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M21 12H9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CartIcon = ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" fill={color} />
    <Path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" fill={color} />
    <Path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function HomeScreen({ navigation }: any) {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { logout, user } = useAuth();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const userFirstName = user?.firstName ?? 'Kullanıcı';
  const iyilikBalance = user?.iyilikBalance ?? 0;
  const walletBalance = user?.walletBalance ?? 0;

  const [activeFilter, setActiveFilter] = useState('Hepsi');
  const [searchText, setSearchText] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Custom Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', icon: '' });
  const [logoutSuccessVisible, setLogoutSuccessVisible] = useState(false);
  const [loginSuccessVisible, setLoginSuccessVisible] = useState(false);
  
  const justLoggedIn = useSelector((state: RootState) => state.auth.justLoggedIn);

  const showAlert = (title: string, message: string, icon: string = '✨') => {
    setModalContent({ title, message, icon });
    setModalVisible(true);
  };

  const categoryConfigs: any = {
    'temel gıda': { icon: '🍎', color: '#EF4444' },
    'giyim & aksesuar': { icon: '👕', color: '#3B82F6' },
    'temizlik & hijyen': { icon: '✨', color: '#10B981' },
    'anne & çocuk': { icon: '🧸', color: '#F472B6' },
    'evcil hayvan': { icon: '🐾', color: '#FB923C' },
    'eğitim & kırtasiye': { icon: '📚', color: '#3B82F6' },
    'gıda': { icon: '🍎', color: '#EF4444' },
    'giyim': { icon: '👕', color: '#3B82F6' },
    'hijyen': { icon: '✨', color: '#10B981' },
    'çocuk': { icon: '🧸', color: '#F472B6' },
    'hayvan': { icon: '🐾', color: '#FB923C' },
    'eğitim': { icon: '📚', color: '#3B82F6' },
    'default': { icon: '📦', color: '#6B7280' }
  };

  const toggleFavorite = async (productId: string) => {
    if (!user) {
      showAlert('Giriş Gerekli', 'Ürünleri favorilere eklemek için lütfen giriş yapın.', '🔒');
      return;
    }

    try {
      await api.favorites.toggle(productId);
      setFavorites(prev => {
        const isCurrentlyFavorite = prev.includes(productId);

        const msg = isCurrentlyFavorite ? 'Favorilerden çıkarıldı' : 'Favorilere eklendi ❤️';
        if (Platform.OS === 'android') {
          ToastAndroid.show(msg, ToastAndroid.SHORT);
        }

        return isCurrentlyFavorite
          ? prev.filter(id => id !== productId)
          : [...prev, productId];
      });
    } catch (error) {
      console.log('Error toggling favorite:', error);
      showAlert('Hata', 'Favori işlemi sırasında bir sorun oluştu.', '❌');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [activeFilter, popularProducts]);

  useEffect(() => {
    if (justLoggedIn) {
      setLoginSuccessVisible(true);
      dispatch(resetLoggedIn());
      setTimeout(() => {
        setLoginSuccessVisible(false);
      }, 3000);
    }
  }, [justLoggedIn]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesData, productsData, campaignsData] = await Promise.all([
        api.categories.getAll(),
        api.products.getAll(),
        api.campaigns.getAll()
      ]);
      setCategories(categoriesData);
      setAllProducts(productsData);
      setPopularProducts(productsData.slice(0, 6)); 
      setCampaigns(campaignsData);

      if (user) {
        try {
          const response: any = await api.favorites.getProducts();
          const favs = response.data || response;
          const favoritesList = Array.isArray(favs) ? favs : (favs.data || []);
          if (Array.isArray(favoritesList)) {
            setFavorites(favoritesList.map((p: any) => p.id));
          }
        } catch (e) {
          console.log('Error fetching favorites:', e);
        }
      }
    } catch (error: any) {
      console.log('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let result = [...allProducts];

    if (activeFilter === 'Bağış Ürünleri') {
      result = allProducts.filter(p =>
        p.category?.toLowerCase().includes('bağış') ||
        p.category?.toLowerCase().includes('hayvan') ||
        p.category?.toLowerCase().includes('çocuk') ||
        p.isDonationProduct === true
      );
    } else if (activeFilter === 'İndirimdekiler') {
      result = allProducts.filter(p =>
        (p.oldPrice && p.oldPrice > p.price) ||
        p.isFlashSale === true ||
        p.price < 200
      );
    } else if (activeFilter === 'Popüler') {
      result = [...allProducts].sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
    } else if (activeFilter === 'Yeni') {
      result = allProducts.filter(p => p.isNewSeason === true);
      if (result.length === 0) {
        result = [...allProducts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    }

    setFilteredProducts(result.slice(0, 10)); 
  };

  const handleLogout = () => {
    showAlert('Çıkış', 'Oturumu kapatmak istediğinize emin misiniz?', '👋');
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
    const campaignProduct = allProducts.find(p => p.campaign?.id === campaign.id);
    if (!campaignProduct) {
       showAlert('Hata', 'Bu kampanyaya ait ürün bulunamadı.', '❌');
       return;
    }
    navigation.navigate('DonationFlow', {
      product: {
        ...campaignProduct,
        image: campaignProduct.imageUrl || campaign.imageUrl || '📦',
        seller: 'Bağış Kampanyası',
        isDonation: true
      },
      campaign: campaign,
      isCampaign: true
    });
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { backgroundColor: theme.surface }]}>
          <View style={styles.headerTop}>
            <Text style={[styles.logoText, { color: theme.accent }]}>İyilik Sepeti</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <TouchableOpacity onPress={handleLogout} style={{ padding: 4 }}>
                <LogoutIcon color={theme.accent} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Sepetim')}>
                <View style={styles.cartIconContainer}>
                  <CartIcon color={theme.text1} />
                  {cartItemCount > 0 && (
                    <View style={[styles.cartBadge, { backgroundColor: theme.error }]}>
                      <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Welcome Card */}
          <View style={styles.welcomeCardShadowContainer}>
            <TouchableOpacity 
              activeOpacity={0.9}
              style={styles.welcomeCardContainer}
              onPress={() => navigation.navigate('Profil')}
            >
              <View style={styles.welcomeCardInternal}>
                <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                  <Defs>
                    <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <Stop offset="0%" stopColor={theme.accent} stopOpacity="1" />
                      <Stop offset="100%" stopColor={theme.accentDark || '#059669'} stopOpacity="1" />
                    </LinearGradient>
                  </Defs>
                  <Rect width="100%" height="100%" fill="url(#grad)" rx="24" ry="24" />
                  <Circle cx="10%" cy="10%" r="40" fill="white" fillOpacity="0.05" />
                  <Circle cx="90%" cy="80%" r="60" fill="white" fillOpacity="0.08" />
                  <Circle cx="80%" cy="10%" r="30" fill="white" fillOpacity="0.03" />
                </Svg>

                {user ? (
                  <View style={styles.welcomeContentRow}>
                    <View style={styles.welcomeTextSection}>
                      <Text style={styles.welcomeGreetingText}>Merhaba, ✨</Text>
                      <Text style={styles.welcomeNameText} numberOfLines={1}>
                        {userFirstName}!
                      </Text>
                      
                      <View style={styles.glassBadge}>
                        <View style={styles.badgeSegment}>
                          <Text style={styles.badgeEmoji}>🏆</Text>
                          <Text style={styles.badgeTextVal}>{iyilikBalance}</Text>
                          <Text style={styles.badgeLabel}>Puan</Text>
                        </View>
                        <View style={styles.badgeDivider} />
                        <View style={styles.badgeSegment}>
                          <Text style={styles.badgeEmoji}>💳</Text>
                          <Text style={styles.badgeTextVal}>{walletBalance}₺</Text>
                          <Text style={styles.badgeLabel}>Cüzdan</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.avatarGlowContainer}>
                      <View style={[styles.avatarGlow, { borderColor: 'rgba(255,255,255,0.4)' }]}>
                        <View style={styles.avatarInnerCircle}>
                          <Text style={{ fontSize: 36 }}>👤</Text>
                        </View>
                      </View>
                      <View style={styles.onlineDot} />
                    </View>
                  </View>
                ) : (
                  <View style={styles.welcomeContentRow}>
                    <View style={styles.welcomeTextSection}>
                      <Text style={styles.welcomeGreetingText}>Hoş Geldiniz, ✨</Text>
                      <Text style={styles.welcomeNameText}>Değerli Ziyaretçi</Text>
                      <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
                        Giriş yapın ve alışverişe başlayın.
                      </Text>
                    </View>
                    <TouchableOpacity 
                      onPress={() => navigation.navigate('Giriş')}
                      style={[styles.loginButtonSmall, { backgroundColor: 'white' }]}
                    >
                      <Text style={{ color: theme.accent, fontWeight: 'bold' }}>Giriş Yap</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>

          <View style={[styles.searchBar, { backgroundColor: theme.bg, borderColor: theme.border, marginTop: 16 }]}>
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
                onPress={() => {
                  setActiveFilter(filter);
                  const navMap: any = {
                    'Bağış Ürünleri': 'Bağış',
                    'İndirimdekiler': 'Flaş İndirim',
                    'Popüler': 'Popüler',
                    'Yeni': 'Yeni Sezon',
                    'Hepsi': 'Hepsi'
                  };
                  navigation.navigate('AllProducts', { categoryName: navMap[filter] || filter });
                }}
                style={[
                  styles.filterChip, 
                  activeFilter === filter ? { backgroundColor: theme.accent } : { backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }
                ]}
              >
                <Text style={[styles.filterText, activeFilter === filter ? { color: 'white' } : { color: theme.text2 }]}>{filter}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Stories */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesContainer} contentContainerStyle={styles.storiesContent}>
            <TouchableOpacity style={styles.storyItem} onPress={() => showAlert('Canlı Yayın', 'Şu an aktif bir yayın bulunmamaktadır.', '🎬')}>
              <View style={[styles.storyCircle, { borderColor: '#10B981' }]}>
                <View style={[styles.storyInner, { backgroundColor: theme.isDark ? theme.bg : '#F3F4F6' }]}><Text style={{ fontSize: 24 }}>🎬</Text></View>
              </View>
              <Text style={[styles.storyText, { color: theme.text2 }]}>Canlı</Text>
            </TouchableOpacity>
            {['Mama Dağıtımı', 'Yeni Okul', 'Sokak Dostları', 'Duyuru'].map((story, index) => (
              <TouchableOpacity key={index} style={styles.storyItem} onPress={() => showAlert('Hikaye', `${story} videosu yükleniyor...`, ['🐕', '🎒', '🦴', '📢'][index])}>
                <View style={[styles.storyCircle, { borderColor: theme.accent }]}>
                  <View style={[styles.storyInner, { backgroundColor: theme.isDark ? theme.bg : '#F3F4F6' }]}><Text style={{ fontSize: 24 }}>{['🐕', '🎒', '🦴', '📢'][index]}</Text></View>
                </View>
                <Text style={[styles.storyText, { color: theme.text2 }]} numberOfLines={1}>{story}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Hero Banner */}
          <View style={[styles.heroBanner, { backgroundColor: theme.isDark ? theme.surface : '#F3F4F6', borderColor: theme.border }]}>
            <View style={styles.heroContent}>
              <Text style={[styles.heroTitle, { color: theme.text1 }]}>Yeni Sezon Ürünler 🌟</Text>
              <Text style={[styles.heroSubtitle, { color: theme.text2 }]}>En kaliteli ürünler, en uygun fiyatlarla kapında.</Text>
              <TouchableOpacity style={[styles.heroButton, { backgroundColor: theme.accent }]} onPress={() => navigation.navigate('AllProducts', { categoryName: 'Yeni Sezon' })}>
                <Text style={[styles.heroButtonText, { color: 'white' }]}>Koleksiyonu İncele</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* İyilik Banner */}
          {iyilikBalance > 0 && (
            <View style={[styles.iyilikBanner, { backgroundColor: theme.accent + '10', borderColor: theme.accent + '30' }]}>
              <View style={styles.iyilikContent}>
                <View style={styles.iyilikTextContainer}>
                  <Text style={[styles.iyilikTitle, { color: theme.accent }]}>✨ İyilik Kumbaranda ₺{iyilikBalance} Birikti!</Text>
                  <Text style={[styles.iyilikSubtitle, { color: theme.text2 }]}>
                    {iyilikBalance >= 10
                      ? 'Bir kampanya seçip bu birikimi bağışlayabilirsin.'
                      : 'Alışverişlerini yuvarlayarak bu kumbarayı büyütebilirsin.'}
                  </Text>
                </View>
                {iyilikBalance >= 10 && (
                  <TouchableOpacity
                    style={[styles.iyilikButton, { backgroundColor: theme.accent }]}
                    onPress={() => navigation.navigate('AllProducts', { categoryName: 'Bağış' })}
                  >
                    <Text style={styles.iyilikButtonText}>Bağışla</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {/* Quick Access */}
          <View style={styles.quickAccess}>
            <TouchableOpacity style={styles.quickItem} onPress={() => navigation.navigate('AllProducts', { categoryName: 'Flaş İndirim' })}>
              <View style={[styles.quickIcon, { backgroundColor: '#3B82F615' }]}><Text style={{ fontSize: 24 }}>⚡</Text></View>
              <Text style={[styles.quickText, { color: theme.text2 }]}>Flaş İndirim</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickItem} onPress={() => navigation.navigate('AllProducts', { categoryName: 'Bağış' })}>
              <View style={[styles.quickIcon, { backgroundColor: '#10B98115' }]}><Text style={{ fontSize: 24 }}>🤝</Text></View>
              <Text style={[styles.quickText, { color: theme.text2 }]}>Bağışla</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickItem} onPress={() => navigation.navigate('AllProducts', { categoryName: 'Popüler' })}>
              <View style={[styles.quickIcon, { backgroundColor: '#F59E0B15' }]}><Text style={{ fontSize: 24 }}>⭐</Text></View>
              <Text style={[styles.quickText, { color: theme.text2 }]}>Popüler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickItem} onPress={() => navigation.navigate('NearMe')}>
              <View style={[styles.quickIcon, { backgroundColor: '#EC489915' }]}><Text style={{ fontSize: 24 }}>📍</Text></View>
              <Text style={[styles.quickText, { color: theme.text2 }]}>Yakınımda</Text>
            </TouchableOpacity>
          </View>

          {/* Categories */}
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
                  onPress={() => navigation.navigate('AllProducts', { categoryName: category.name })}
                >
                  <View style={[styles.categoryIconContainer, { backgroundColor: config.color + '15', overflow: 'hidden' }]}>
                    {category.imageUrl ? (
                      <Image 
                        source={{ uri: category.imageUrl }} 
                        style={StyleSheet.absoluteFill} 
                        resizeMode="cover"
                      />
                    ) : (
                      <Text style={styles.categoryIcon}>{config.icon}</Text>
                    )}
                  </View>
                  <Text style={[styles.categoryName, { color: theme.text2 }]} numberOfLines={1}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Popular Products */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text1 }]}>🔥 Öne Çıkan Ürünler</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AllProducts')}>
              <Text style={[styles.seeAll, { color: theme.accent }]}>Tümü →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.productsGrid}>
            {filteredProducts.map((product) => {
              const isFavorite = favorites.includes(product.id);
              return (
                <TouchableOpacity
                  key={product.id}
                  style={[styles.productCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                  onPress={() => navigation.navigate('ProductDetail', { product })}
                >
                  <View style={[styles.productImageContainer, { backgroundColor: theme.bg }]}>
                    {product.imageUrl ? (
                      <Image 
                        source={{ uri: product.imageUrl }} 
                        style={StyleSheet.absoluteFill} 
                        resizeMode="cover"
                      />
                    ) : (
                      <Text style={{ fontSize: 40 }}>{categoryConfigs[product.category.toLowerCase()]?.icon || '📦'}</Text>
                    )}
                    <TouchableOpacity
                      style={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 15, padding: 5 }}
                      onPress={() => toggleFavorite(product.id)}
                    >
                      <Text style={{ fontSize: 18, color: isFavorite ? '#EF4444' : theme.text3 }}>{isFavorite ? '❤️' : '🤍'}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={[styles.productName, { color: theme.text1 }]} numberOfLines={2}>{product.name}</Text>
                    <View style={styles.productPriceRow}>
                      <Text style={[styles.productPrice, { color: theme.accent }]}>{product.price.toLocaleString('tr-TR')} ₺</Text>
                    </View>
                    
                    <View style={styles.productActionsRow}>
                      <TouchableOpacity 
                        style={[styles.shoppingCartButton, { backgroundColor: theme.accent + '15' }]} 
                        onPress={() => handleAddToCart(product)}
                      >
                        <Text style={{ fontSize: 16 }}>🛒</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.donateProductButton, { backgroundColor: theme.accent }]} 
                        onPress={() => handleDonateProduct(product)}
                      >
                        <Text style={styles.donateProductText}>Bağışla</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>

          {/* Campaigns */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text1 }]}>🙏 BAĞIŞ KAMPANYALARI</Text>
          </View>
          {campaigns.map((campaign) => (
            <View
              key={campaign.id}
              style={[styles.campaignCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
              <View style={styles.campaignHeader}>
                <View style={[styles.campaignImage, { backgroundColor: theme.bg, overflow: 'hidden' }]}>
                  {campaign.imageUrl ? (
                    <Image 
                      source={{ uri: campaign.imageUrl }} 
                      style={StyleSheet.absoluteFill} 
                      resizeMode="cover"
                    />
                  ) : (
                    <Text style={{ fontSize: 30 }}>{campaign.title.includes('Hayvan') ? '🐾' : '🎒'}</Text>
                  )}
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
                      width: `${campaign.targetCount > 0 ? Math.min(100, (campaign.raisedCount / campaign.targetCount) * 100) : 0}%`
                    }
                  ]}
                />
              </View>
            </View>
          ))}
          <View style={{ height: 20 }} />
        </View>
      </ScrollView>

      {/* Alert Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <TouchableOpacity style={styles.closeModal} onPress={() => setModalVisible(false)}>
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
                    setLogoutSuccessVisible(true);
                    setTimeout(async () => {
                      setLogoutSuccessVisible(false);
                      await logout();
                    }, 1500);
                  }
                }}
              >
                <Text style={styles.closeButtonText}>{modalContent.title === 'Çıkış' ? 'Çıkış Yap' : 'Tamam'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Login Success Modal */}
      <Modal animationType="fade" transparent={true} visible={loginSuccessVisible}>
        <View style={styles.modalOverlay}>
          <View style={[styles.loginSuccessContent, { backgroundColor: theme.surface }]}>
            <View style={[styles.loginSuccessHeader, { backgroundColor: theme.accentDark || theme.accent }]}>
              <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                <Circle cx="20%" cy="20%" r="30" fill="white" fillOpacity="0.1" />
                <Circle cx="80%" cy="80%" r="50" fill="white" fillOpacity="0.15" />
              </Svg>
              <View style={styles.successIconOuter}>
                <View style={styles.successIconInner}>
                  <Text style={{ fontSize: 40 }}>🏆</Text>
                </View>
              </View>
            </View>
            <View style={styles.loginSuccessBody}>
              <Text style={[styles.loginSuccessTitle, { color: theme.text1 }]}>Tekrar Hoş Geldiniz!</Text>
              <Text style={[styles.loginSuccessMessage, { color: theme.text3 }]}>
                {user?.firstName || 'Kullanıcı'}, keyifli alışverişler ve iyilik dolu bir gün dileriz! ✨
              </Text>
              <TouchableOpacity 
                style={[styles.loginSuccessButton, { backgroundColor: theme.accent }]}
                onPress={() => setLoginSuccessVisible(false)}
              >
                <Text style={[styles.loginSuccessButtonText, { color: 'white' }]}>Hadi Başlayalım!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Logout Success Modal */}
      <Modal animationType="fade" transparent={true} visible={logoutSuccessVisible}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface, paddingVertical: 40 }]}>
            <View style={[styles.successRing, { borderColor: theme.accent + '20' }]}>
              <View style={[styles.successCircle, { backgroundColor: theme.accent }]}>
                <Text style={{ fontSize: 32, color: 'white' }}>✓</Text>
              </View>
            </View>
            <Text style={[styles.modalTitle, { color: theme.text1, marginTop: 20 }]}>Başarıyla Çıkış Yapıldı</Text>
            <Text style={[styles.modalMessage, { color: theme.text3, marginBottom: 0 }]}>Yine bekleriz, keyifli alışverişler! ✨</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, paddingTop: 60 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  logoText: { fontSize: 24, fontWeight: 'bold', letterSpacing: -1 },
  welcomeCardShadowContainer: { marginVertical: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 10 },
  welcomeCardContainer: { borderRadius: 24, overflow: 'hidden', backgroundColor: '#10B981' },
  welcomeCardInternal: { padding: 22, minHeight: 150, justifyContent: 'center' },
  loginButtonSmall: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  welcomeContentRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 1 },
  welcomeTextSection: { flex: 1, marginRight: 16 },
  welcomeGreetingText: { fontSize: 16, color: 'rgba(255,255,255,0.85)', fontWeight: '500', marginBottom: 4 },
  welcomeNameText: { fontSize: 22, color: 'white', fontWeight: 'bold', marginBottom: 12, letterSpacing: -0.5 },
  glassBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.22)', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6, alignSelf: 'flex-start', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' },
  badgeSegment: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  badgeEmoji: { fontSize: 14 },
  badgeTextVal: { fontSize: 16, fontWeight: 'bold', color: 'white' },
  badgeLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
  badgeDivider: { width: 1, height: 16, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: 12 },
  avatarGlowContainer: { position: 'relative' },
  avatarGlow: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)' },
  avatarInnerCircle: { width: 66, height: 66, borderRadius: 33, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  onlineDot: { position: 'absolute', bottom: 4, right: 4, width: 14, height: 14, borderRadius: 7, backgroundColor: '#10B981', borderWidth: 2, borderColor: 'white' },
  loginSuccessContent: { width: '85%', borderRadius: 32, overflow: 'hidden', elevation: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 15 },
  loginSuccessHeader: { height: 160, justifyContent: 'center', alignItems: 'center' },
  successIconOuter: { width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  successIconInner: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  loginSuccessBody: { padding: 24, alignItems: 'center' },
  loginSuccessTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  loginSuccessMessage: { fontSize: 16, textAlign: 'center', marginBottom: 24, lineHeight: 22 },
  loginSuccessButton: { width: '100%', height: 54, borderRadius: 27, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  loginSuccessButtonText: { fontSize: 16, fontWeight: 'bold' },
  cartIconContainer: { position: 'relative', padding: 8, backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 12 },
  cartBadge: { position: 'absolute', top: -2, right: -2, borderRadius: 10, minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4, borderWidth: 2, borderColor: 'white' },
  cartBadgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, height: 50, borderRadius: 16, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
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
  productCard: { width: '48%', borderRadius: 20, marginBottom: 20, padding: 8, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, borderWidth: 1 },
  productImageContainer: { width: '100%', height: 150, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 10, overflow: 'hidden' },
  productInfo: { paddingHorizontal: 4, flex: 1, justifyContent: 'space-between' },
  productName: { fontSize: 15, fontWeight: '600', marginBottom: 6, lineHeight: 18, height: 36 },
  productPriceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  productPrice: { fontSize: 18, fontWeight: 'bold' },
  productActionsRow: { flexDirection: 'row', gap: 8, marginTop: 'auto' },
  shoppingCartButton: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  donateProductButton: { flex: 1, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  donateProductText: { fontSize: 12, fontWeight: 'bold', color: 'white' },
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
  closeButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  successRing: { width: 100, height: 100, borderRadius: 50, borderWidth: 8, justifyContent: 'center', alignItems: 'center' },
  successCircle: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
  iyilikBanner: { marginVertical: 10, borderRadius: 20, padding: 15, borderWidth: 1, marginBottom: 25 },
  iyilikContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iyilikTextContainer: { flex: 1, marginRight: 10 },
  iyilikTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  iyilikSubtitle: { fontSize: 12, opacity: 0.8 },
  iyilikButton: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12 },
  iyilikButtonText: { color: 'white', fontSize: 13, fontWeight: 'bold' },
});
