import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator, SafeAreaView, TextInput, Modal, Platform } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { productService } from '../../services/product/productService';
import { CategoryResponse } from '../../services/api/types';

const CategoryManagementScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // For adding/editing
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryResponse | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categoryImageUrl, setCategoryImageUrl] = useState('');
  const [categoryType, setCategoryType] = useState<'SHOPPING' | 'DONATION' | 'BOTH'>('BOTH');
  const [isSaving, setIsSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, [])
  );

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const data = await productService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      Alert.alert('Hata', 'Kategoriler yüklenirken bir sorun oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!categoryName) return;
    
    try {
      setIsSaving(true);
      const payload = {
        name: categoryName,
        description: categoryDescription,
        imageUrl: categoryImageUrl,
        type: categoryType
      };

      if (editingCategory) {
        await productService.updateCategory(editingCategory.id, payload);
        Alert.alert('Başarılı', 'Kategori güncellendi');
      } else {
        await productService.createCategory(payload);
        Alert.alert('Başarılı', 'Kategori oluşturuldu');
      }
      
      setModalVisible(false);
      loadCategories();
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Kategori kaydedilemedi.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = (id: string, name: string) => {
    Alert.alert(
      'Kategoriyi Sil',
      `"${name}" kategorisini silmek istediğinize emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Sil', 
          style: 'destructive',
          onPress: async () => {
            try {
              await productService.deleteCategory(id);
              loadCategories();
            } catch (error) {
              Alert.alert('Hata', 'Kategori silinirken bir hata oluştu.');
            }
          }
        }
      ]
    );
  };

  const renderCategoryItem = ({ item }: { item: CategoryResponse }) => (
    <View style={[styles.categoryCard, { backgroundColor: theme.surface }]}>
    <View style={[styles.categoryIcon, { backgroundColor: theme.bg, overflow: 'hidden' }]}>
      {item.imageUrl ? (
        <Image 
          source={{ uri: item.imageUrl }} 
          style={StyleSheet.absoluteFill} 
          resizeMode="cover"
        />
      ) : (
        <Text style={{ fontSize: 24 }}>{item.type === 'DONATION' ? '❤️' : item.type === 'SHOPPING' ? '🛒' : '✨'}</Text>
      )}
    </View>
      <View style={styles.categoryInfo}>
        <Text style={[styles.categoryName, { color: theme.text1 }]}>{item.name}</Text>
        <Text style={[styles.categoryType, { color: theme.text4 }]}>{item.type}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: theme.accent + '20' }]}
          onPress={() => {
            setEditingCategory(item);
            setCategoryName(item.name);
            setCategoryDescription(item.description || '');
            setCategoryImageUrl(item.imageUrl || '');
            setCategoryType(item.type);
            setModalVisible(true);
          }}
        >
          <Text style={{ fontSize: 16 }}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#EF444420', marginTop: 10 }]}
          onPress={() => handleDeleteCategory(item.id, item.name)}
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
        <Text style={[styles.headerTitle, { color: theme.text1 }]}>Kategori Yönetimi</Text>
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: theme.accent }]}
            onPress={() => {
              setEditingCategory(null);
              setCategoryName('');
              setCategoryDescription('');
              setCategoryImageUrl('');
              setCategoryType('BOTH');
              setModalVisible(true);
            }}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.text1 }]}>
              {editingCategory ? 'Kategoriyi Düzenle' : 'Yeni Kategori'}
            </Text>
            
            <TextInput
              style={[styles.input, { backgroundColor: theme.bg, color: theme.text1, borderColor: theme.border }]}
              placeholder="Kategori Adı"
              placeholderTextColor={theme.text4}
              value={categoryName}
              onChangeText={setCategoryName}
            />

            <TextInput
              style={[styles.input, { backgroundColor: theme.bg, color: theme.text1, borderColor: theme.border, height: 70 }]}
              placeholder="Açıklama"
              placeholderTextColor={theme.text4}
              value={categoryDescription}
              onChangeText={setCategoryDescription}
              multiline
            />

            <TextInput
              style={[styles.input, { backgroundColor: theme.bg, color: theme.text1, borderColor: theme.border }]}
              placeholder="Görsel URL (https://...)"
              placeholderTextColor={theme.text4}
              value={categoryImageUrl}
              onChangeText={setCategoryImageUrl}
            />

            {categoryImageUrl ? (
              <View style={styles.previewContainer}>
                <Image 
                  source={{ uri: categoryImageUrl }} 
                  style={styles.previewImage} 
                  resizeMode="cover"
                />
              </View>
            ) : null}

            <View style={styles.typeSelector}>
              {(['SHOPPING', 'DONATION', 'BOTH'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeChip,
                    { 
                      backgroundColor: categoryType === type ? theme.accent : theme.bg,
                      borderColor: theme.border
                    }
                  ]}
                  onPress={() => setCategoryType(type)}
                >
                  <Text style={{ color: categoryType === type ? 'white' : theme.text2, fontSize: 12 }}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: theme.bg }]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: theme.text2, fontWeight: 'bold' }}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: theme.accent }]} 
                onPress={handleSave}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingTop: Platform.OS === 'android' ? 45 : 20,
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
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 20,
  },
  categoryCard: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 15,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryInfo: {
    flex: 1,
    marginLeft: 15,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryType: {
    fontSize: 12,
    marginTop: 2,
  },
  actionButtons: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: 25,
    padding: 25,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    marginBottom: 20,
  },
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  typeChip: {
    flex: 1,
    marginHorizontal: 4,
    height: 35,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    height: 45,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewContainer: {
    width: '100%',
    height: 100,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
});

export default CategoryManagementScreen;
