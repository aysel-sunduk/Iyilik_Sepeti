import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator,
  Dimensions 
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

  useEffect(() => {
    fetchProducts();
  }, [activeCategory]);

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
      if (activeCategory === 'Hepsi') {
        productsData = await api.products.getAll();
      } else {
        productsData = await api.products.getByCategory(activeCategory);
      }
      setProducts(productsData);
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

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity 
      style={[styles.productCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <View style={[styles.imagePlaceholder, { backgroundColor: theme.bg }]}>
        <Text style={{ fontSize: 40 }}>{item.category.toLowerCase().includes('gıda') ? '🍎' : item.category.toLowerCase().includes('giyim') ? '👕' : '📦'}</Text>
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
  );

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
          data={['Hepsi', ...categories.map(c => c.name)]}
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
