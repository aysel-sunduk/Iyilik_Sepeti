import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { productService, Category } from '../../services/product/productService';

const categoryConfigs: any = {
  'gıda': { icon: '🍎', color: '#EF4444' },
  'giyim': { icon: '👕', color: '#3B82F6' },
  'hijyen': { icon: '✨', color: '#10B981' },
  'çocuk': { icon: '🧸', color: '#F472B6' },
  'hayvan': { icon: '🐾', color: '#FB923C' },
  'default': { icon: '📦', color: '#6B7280' }
};

export default function CategoriesScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const renderItem = ({ item }: { item: Category }) => {
    const config = categoryConfigs[item.name.toLowerCase()] || categoryConfigs['default'];
    
    return (
      <TouchableOpacity 
        style={[styles.categoryCard, { backgroundColor: theme.surface, borderColor: theme.border + '50' }]}
        onPress={() => navigation.navigate('Ana Sayfa', { categoryName: item.name })}
      >
        <View style={[styles.categoryIcon, { backgroundColor: config.color + '15' }]}>
          <Text style={{ fontSize: 40 }}>{config.icon}</Text>
        </View>
        <Text style={[styles.categoryName, { color: theme.text1 }]}>{item.name}</Text>
        <Text style={[styles.productCount, { color: theme.text4 }]}>Ürünleri İncele →</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.bg, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 24, color: theme.text1 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text1 }]}>Kategoriler</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  list: { padding: 16 },
  categoryCard: { flex: 1, alignItems: 'center', padding: 20, margin: 8, borderRadius: 20 },
  categoryIcon: { width: 70, height: 70, borderRadius: 35, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  categoryName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  productCount: { fontSize: 11 },
});