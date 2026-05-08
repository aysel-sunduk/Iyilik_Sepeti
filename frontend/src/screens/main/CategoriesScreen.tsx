import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Image, Platform } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api/api';
import { CategoryResponse as Category } from '../../services/api/types';

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

export default function CategoriesScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.categories.getAll();
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
        style={[styles.categoryCard, { backgroundColor: theme.surface }]}
        onPress={() => navigation.navigate('AllProducts', { categoryName: item.name })}
      >
        <View style={styles.imageOverlay}>
          {item.imageUrl ? (
            <Image 
              source={{ uri: item.imageUrl }} 
              style={StyleSheet.absoluteFill} 
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.categoryIcon, { backgroundColor: config.color + '15' }]}>
              <Text style={{ fontSize: 32 }}>{config.icon}</Text>
            </View>
          )}
          <View style={styles.gradientOverlay} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.categoryName, { color: 'white' }]}>{item.name}</Text>
          <Text style={[styles.productCount, { color: 'rgba(255,255,255,0.8)' }]}>Ürünleri Keşfet</Text>
        </View>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: Platform.OS === 'android' ? 45 : 60 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  list: { padding: 16 },
  categoryCard: { 
    flex: 1, 
    height: 180,
    margin: 8, 
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 5,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFill,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 15,
  },
  categoryIcon: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  categoryName: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 4,
  },
  productCount: { 
    fontSize: 12,
  },
});