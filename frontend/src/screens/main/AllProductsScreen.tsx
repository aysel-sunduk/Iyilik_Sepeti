import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator,
  Dimensions,
  ToastAndroid,
  Platform,
  Image
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import api from '../../services/api/api';
import { ProductResponse as Product, CategoryResponse as Category } from '../../services/api/types';

const { width } = Dimensions.get('window');

export default function AllProductsScreen({ navigation, route }: any) {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const initialCategory = route.params?.categoryName || 'Hepsi';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  // Listen for navigation parameter changes and force state update
  useEffect(() => {
    const categoryFromParams = route.params?.categoryName;
    if (categoryFromParams) {
      setActiveCategory(categoryFromParams);
    }
  }, [route.params?.categoryName]);

  useEffect(() => {
    fetchProducts();
    fetchFavorites();
  }, [activeCategory]);

  const fetchFavorites = async () => {
    try {
      const favResponse = await api.favorites.getProducts();
      const favs = favResponse.data || favResponse;
      if (Array.isArray(favs)) {
        setFavorites(favs.map((p: any) => p.id));
      }
    } catch(e) {
      console.log('User might not be logged in or error fetching favorites');
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesData = await api.categories.getAll();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let productsData;
      if (activeCategory === 'Yeni Sezon') {
        // Yeni sezon filtresi - createdAt DESC
        const response = await api.products.getFiltered({ sortBy: 'createdAt', sortDirection: 'DESC' });
        productsData = response.content || [];
      } else if (activeCategory === 'Bağış') {
        productsData = await api.products.getDonationProducts();
      } else if (activeCategory === 'Flaş İndirim') {
        productsData = await api.products.getFlashSales();
      } else if (activeCategory === 'Popüler') {
        productsData = await api.products.getPopularDonationProducts(20);
      } else if (activeCategory === 'Yakınımda') {
        // Fallback for location, hardcoded for demo or use Geolocation API
        productsData = await api.products.getNearbyProducts(41.0082, 28.9784, 10);
      } else if (activeCategory === 'Hepsi') {
        productsData = await api.products.getAll();
      } else {
        productsData = await api.products.getByCategory(activeCategory);
      }
      setProducts(productsData || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchText.toLowerCase());
    return matchesSearch;
  });

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
  };

  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = async (productId: string) => {
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
      console.error('Error toggling favorite:', error);
    }
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    const isFavorite = favorites.includes(item.id);
    return (
    <TouchableOpacity 
      style={[styles.productCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <View style={[styles.imagePlaceholder, { backgroundColor: theme.bg, overflow: 'hidden' }]}>
        {item.imageUrl ? (
          <Image 
            source={{ uri: item.imageUrl }} 
            style={StyleSheet.absoluteFill} 
            resizeMode="cover"
          />
        ) : (
          <Text style={{ fontSize: 40 }}>{item.category.toLowerCase().includes('gıda') ? '🍎' : item.category.toLowerCase().includes('giyim') ? '👕' : '📦'}</Text>
        )}
        <TouchableOpacity 
          style={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 15, padding: 5 }}
          onPress={() => toggleFavorite(item.id)}
        >
          <Text style={{ fontSize: 18, color: isFavorite ? '#EF4444' : theme.text3 }}>{isFavorite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.productInfo}>
        <Text style={[styles.productName, { color: theme.text1 }]} numberOfLines={1}>{item.name}</Text>
        <Text style={[styles.productCategory, { color: theme.text3 }]}>{item.category}</Text>
        <View style={styles.priceRow}>
          <Text style={[styles.productPrice, { color: theme.accent }]}>{item.price.toLocaleString('tr-TR')} ₺</Text>
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: theme.accent }]}
            onPress={() => handleAddToCart(item)}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )};

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ fontSize: 24, color: theme.text1 }}>←</Text>
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Ürün ara..."
            placeholderTextColor={theme.text3}
            style={[styles.searchInput, { color: theme.text1, backgroundColor: theme.bg }]}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Category Filter */}
      <View style={{ backgroundColor: theme.surface }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={['Hepsi', 'Yeni Sezon', 'Flaş İndirim', 'Bağış', 'Popüler', 'Yakınımda', ...categories.map(c => c.name)]}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => setActiveCategory(item)}
              style={[
                styles.categoryChip,
                { backgroundColor: activeCategory === item ? theme.accent : theme.bg }
              ]}
            >
              <Text style={[
                styles.categoryChipText,
                { color: activeCategory === item ? 'white' : theme.text2 }
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={renderProductItem}
          contentContainerStyle={styles.productList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={{ fontSize: 40, marginBottom: 10 }}>🔍</Text>
              <Text style={{ color: theme.text3 }}>Aradığınız kriterde ürün bulunamadı.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 15, 
    paddingTop: 60, 
    paddingBottom: 15,
    gap: 10
  },
  backBtn: { padding: 5 },
  searchContainer: { flex: 1 },
  searchInput: { height: 44, borderRadius: 22, paddingHorizontal: 20, fontSize: 14 },
  categoryList: { paddingHorizontal: 15, paddingVertical: 12 },
  categoryChip: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  categoryChipText: { fontSize: 13, fontWeight: '600' },
  productList: { padding: 10 },
  productCard: { 
    width: (width - 40) / 2, 
    margin: 5, 
    borderRadius: 20, 
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5
  },
  imagePlaceholder: { width: '100%', height: 150, justifyContent: 'center', alignItems: 'center' },
  productInfo: { padding: 12 },
  productName: { fontSize: 14, fontWeight: 'bold', marginBottom: 2 },
  productCategory: { fontSize: 11, marginBottom: 8 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { fontSize: 16, fontWeight: 'bold' },
  addButton: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  addButtonText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, alignItems: 'center', marginTop: 100 }
});
