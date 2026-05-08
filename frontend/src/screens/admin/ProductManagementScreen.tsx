import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  Alert, 
  ActivityIndicator, 
  SafeAreaView,
  TextInput,
  ScrollView
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { productService } from '../../services/product/productService';
import { ProductResponse, CategoryResponse } from '../../services/api/types';

const ProductManagementScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productService.getProducts(),
        productService.getCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Hata', 'Veriler yüklenirken bir sorun oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteProduct = (id: string, name: string) => {
    Alert.alert(
      'Ürünü Sil',
      `"${name}" ürününü silmek istediğinize emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Sil', 
          style: 'destructive',
          onPress: async () => {
            try {
              await productService.deleteProduct(id);
              setProducts(prev => prev.filter(p => p.id !== id));
              Alert.alert('Başarılı', 'Ürün başarıyla silindi.');
            } catch (error) {
              Alert.alert('Hata', 'Ürün silinirken bir hata oluştu.');
            }
          }
        }
      ]
    );
  };

  const renderProductItem = ({ item }: { item: ProductResponse }) => (
    <View style={[styles.productCard, { backgroundColor: theme.surface }]}>
      <View style={[styles.productImage, { backgroundColor: theme.bg, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }]}>
        {item.imageUrl ? (
          <Image 
            source={{ uri: item.imageUrl }} 
            style={StyleSheet.absoluteFill} 
            resizeMode="cover"
          />
        ) : (
          <Text style={{ fontSize: 30 }}>{item.category.toLowerCase().includes('gıda') ? '🍎' : item.category.toLowerCase().includes('giyim') ? '👕' : '📦'}</Text>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={[styles.productName, { color: theme.text1 }]} numberOfLines={1}>{item.name}</Text>
        <Text style={[styles.productCategory, { color: theme.text4 }]}>{item.category}</Text>
        <Text style={[styles.productPrice, { color: theme.accent }]}>{item.price.toLocaleString('tr-TR')} TL</Text>
        <View style={styles.stockBadge}>
          <Text style={styles.stockText}>Stok: {item.stockQuantity}</Text>
        </View>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: theme.accent + '20' }]}
          onPress={() => navigation.navigate('ProductEdit', { product: item })}
        >
          <Text style={{ fontSize: 16 }}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#EF444420' }]}
          onPress={() => handleDeleteProduct(item.id, item.name)}
        >
          <Text style={{ fontSize: 16 }}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text1 }]}>Ürün Yönetimi</Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: theme.accent }]}
          onPress={() => navigation.navigate('ProductEdit')}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Section */}
      <View style={styles.filterContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={{ marginRight: 10 }}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: theme.text1 }]}
            placeholder="Ürün ara..."
            placeholderTextColor={theme.text4}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={{ color: theme.text4, fontSize: 18 }}>×</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContent}
        >
          <TouchableOpacity
            style={[
              styles.categoryChip,
              { backgroundColor: selectedCategory === null ? theme.accent : theme.surface, borderColor: theme.border }
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[styles.categoryText, { color: selectedCategory === null ? 'white' : theme.text2 }]}>Hepsi</Text>
          </TouchableOpacity>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                { backgroundColor: selectedCategory === cat.name ? theme.accent : theme.surface, borderColor: theme.border }
              ]}
              onPress={() => setSelectedCategory(cat.name)}
            >
              <Text style={[styles.categoryText, { color: selectedCategory === cat.name ? 'white' : theme.text2 }]}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={{ color: theme.text3 }}>Eşleşen ürün bulunamadı.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  filterContainer: {
    paddingBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 15,
    height: 45,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  categoryScroll: {
    paddingLeft: 20,
  },
  categoryContent: {
    paddingRight: 40,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
  },
  listContent: {
    padding: 20,
    paddingTop: 10,
  },
  productCard: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 15,
  },
  productInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  productCategory: {
    fontSize: 12,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  stockBadge: {
    marginTop: 4,
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  stockText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 80,
    marginLeft: 10,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
});

export default ProductManagementScreen;
