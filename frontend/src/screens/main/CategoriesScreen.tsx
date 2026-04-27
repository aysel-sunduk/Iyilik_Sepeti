import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const categories = [
  { id: 1, name: 'Elektronik', icon: '📱', color: '#10B981', productCount: 24 },
  { id: 2, name: 'Giyim', icon: '👕', color: '#3B82F6', productCount: 56 },
  { id: 3, name: 'Gıda', icon: '🍎', color: '#F59E0B', productCount: 32 },
  { id: 4, name: 'Kozmetik', icon: '💄', color: '#EC4899', productCount: 18 },
  { id: 5, name: 'Oyuncak', icon: '🎮', color: '#8B5CF6', productCount: 27 },
  { id: 6, name: 'Kitap', icon: '📚', color: '#EF4444', productCount: 43 },
  { id: 7, name: 'Mama', icon: '🐕', color: '#F97316', productCount: 12 },
  { id: 8, name: 'Bebek Bezi', icon: '👶', color: '#06B6D4', productCount: 9 },
];

export default function CategoriesScreen({ navigation }: any) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 24 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text1 }]}>Kategoriler</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.categoryCard, { backgroundColor: theme.surface }]}
            onPress={() => navigation.navigate('ProductDetail', { product: { name: item.name, category: item.name } })}
          >
            <View style={[styles.categoryIcon, { backgroundColor: item.color + '20' }]}>
              <Text style={{ fontSize: 40 }}>{item.icon}</Text>
            </View>
            <Text style={[styles.categoryName, { color: theme.text1 }]}>{item.name}</Text>
            <Text style={[styles.productCount, { color: theme.text4 }]}>{item.productCount} ürün</Text>
          </TouchableOpacity>
        )}
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