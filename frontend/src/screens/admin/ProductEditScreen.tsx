import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  SafeAreaView,
  Switch
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { productService } from '../../services/product/productService';
import { ProductResponse, CategoryResponse, CampaignResponse } from '../../services/api/types';

const ProductEditScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const editingProduct = route.params?.product as ProductResponse | undefined;

  const [formData, setFormData] = useState({
    name: editingProduct?.name || '',
    description: editingProduct?.description || '',
    price: editingProduct?.price?.toString() || '',
    imageUrl: editingProduct?.imageUrl || '',
    category: editingProduct?.category || '',
    stockQuantity: editingProduct?.stockQuantity?.toString() || '0',
    unit: editingProduct?.unit || 'Adet',
    isDonationProduct: editingProduct?.isDonationProduct || false,
    campaignId: editingProduct?.campaign?.id || '',
  });

  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignResponse[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingMeta, setIsLoadingMeta] = useState(true);

  useEffect(() => {
    loadMetaData();
  }, []);

  const loadMetaData = async () => {
    try {
      const [cats, cams] = await Promise.all([
        productService.getCategories(),
        productService.getCampaigns()
      ]);
      setCategories(cats);
      setCampaigns(cams);
    } catch (error) {
      console.error('Error loading meta data:', error);
    } finally {
      setIsLoadingMeta(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price || !formData.category) {
      Alert.alert('Uyarı', 'Lütfen zorunlu alanları doldurun (Ad, Fiyat, Kategori)');
      return;
    }

    try {
      setIsSaving(true);
      const productPayload: any = {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, productPayload);
        Alert.alert('Başarılı', 'Ürün güncellendi');
      } else {
        await productService.createProduct(productPayload);
        Alert.alert('Başarılı', 'Ürün oluşturuldu');
      }
      navigation.goBack();
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Hata', 'Kaydedilirken bir sorun oluştu.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderInput = (label: string, field: string, placeholder: string, keyboardType: any = 'default', multiline: boolean = false) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: theme.text2 }]}>{label}</Text>
      <TextInput
        style={[
          styles.input, 
          { 
            backgroundColor: theme.surface, 
            color: theme.text1, 
            borderColor: theme.border,
            height: multiline ? 100 : 50
          }
        ]}
        placeholder={placeholder}
        placeholderTextColor={theme.text4}
        value={(formData as any)[field]}
        onChangeText={(text) => setFormData(prev => ({ ...prev, [field]: text }))}
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text1 }]}>
          {editingProduct ? 'Ürünü Düzenle' : 'Yeni Ürün'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {renderInput('Ürün Adı *', 'name', 'Örn: Su Matarası')}
        {renderInput('Açıklama', 'description', 'Ürün detaylarını girin...', 'default', true)}
        
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            {renderInput('Fiyat *', 'price', '0.00', 'numeric')}
          </View>
          <View style={{ flex: 1 }}>
            {renderInput('Stok Adedi', 'stockQuantity', '0', 'numeric')}
          </View>
        </View>

        {renderInput('Görsel URL', 'imageUrl', 'https://...')}
        
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text2 }]}>Kategori *</Text>
          <View style={styles.pickerContainer}>
            {categories?.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.chip,
                  { 
                    backgroundColor: formData.category === cat.name ? theme.accent : theme.surface,
                    borderColor: theme.border
                  }
                ]}
                onPress={() => setFormData(prev => ({ ...prev, category: cat.name }))}
              >
                <Text style={{ 
                  color: formData.category === cat.name ? 'white' : theme.text2,
                  fontSize: 12
                }}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.inputGroup, styles.switchRow]}>
          <View>
            <Text style={[styles.label, { color: theme.text2 }]}>Bağış Ürünü Mü?</Text>
            <Text style={{ color: theme.text4, fontSize: 12 }}>Bu ürün bir kampanya için mi satılıyor?</Text>
          </View>
          <Switch
            value={formData.isDonationProduct}
            onValueChange={(val) => setFormData(prev => ({ ...prev, isDonationProduct: val }))}
            trackColor={{ false: theme.border, true: theme.accent }}
          />
        </View>

        {formData.isDonationProduct && (
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text2 }]}>İlişkili Kampanya</Text>
            <View style={styles.pickerContainer}>
              {campaigns?.map((cam) => (
                <TouchableOpacity
                  key={cam.id}
                  style={[
                    styles.chip,
                    { 
                      backgroundColor: formData.campaignId === cam.id ? theme.accent : theme.surface,
                      borderColor: theme.border
                    }
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, campaignId: cam.id }))}
                >
                  <Text style={{ 
                    color: formData.campaignId === cam.id ? 'white' : theme.text2,
                    fontSize: 12
                  }}>
                    {cam.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: theme.accent }]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.saveButtonText}>{editingProduct ? 'Güncelle' : 'Oluştur'}</Text>
          )}
        </TouchableOpacity>
        
        <View style={{ height: 40 }} />
      </ScrollView>
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
    paddingTop: 40, // Added padding for status bar/notch
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
  scrollContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderRadius: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  chip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 10,
  },
  saveButton: {
    height: 55,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProductEditScreen;
