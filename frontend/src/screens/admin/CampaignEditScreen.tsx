import React, { useState } from 'react';
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
  Switch,
  Image,
  Platform
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { campaignService } from '../../services/product/campaignService';
import { CampaignResponse } from '../../services/api/types';

const CampaignEditScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const editingCampaign = route.params?.campaign as CampaignResponse | undefined;

  const [formData, setFormData] = useState({
    title: editingCampaign?.title || '',
    description: editingCampaign?.description || '',
    imageUrl: editingCampaign?.imageUrl || '',
    targetAmount: editingCampaign?.targetAmount?.toString() || '',
    unit: editingCampaign?.unit || 'TL',
    isActive: editingCampaign?.isActive ?? true,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!formData.title || !formData.targetAmount) {
      Alert.alert('Uyarı', 'Lütfen zorunlu alanları doldurun (Başlık, Hedef Tutar)');
      return;
    }

    try {
      setIsSaving(true);
      
      let sanitizedImageUrl = formData.imageUrl.trim();
      if (sanitizedImageUrl.length > 100 && !sanitizedImageUrl.startsWith('http')) {
        if (!sanitizedImageUrl.startsWith('data:image')) {
          if (sanitizedImageUrl.startsWith('base64,')) {
            sanitizedImageUrl = 'data:image/jpeg;' + sanitizedImageUrl;
          } else if (sanitizedImageUrl.includes('/9j/')) {
            sanitizedImageUrl = 'data:image/jpeg;base64,' + sanitizedImageUrl.substring(sanitizedImageUrl.indexOf('/9j/'));
          } else if (!sanitizedImageUrl.startsWith('data:')) {
            sanitizedImageUrl = 'data:image/jpeg;base64,' + sanitizedImageUrl;
          }
        }
      }

      const payload: any = {
        ...formData,
        imageUrl: sanitizedImageUrl,
        targetAmount: parseFloat(formData.targetAmount),
      };

      if (editingCampaign) {
        await campaignService.updateCampaign(editingCampaign.id, payload);
        Alert.alert('Başarılı', 'Kampanya güncellendi');
      } else {
        await campaignService.createCampaign(payload);
        Alert.alert('Başarılı', 'Kampanya oluşturuldu');
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
            height: multiline ? 120 : 50
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
          {editingCampaign ? 'Kampanyayı Düzenle' : 'Yeni Kampanya'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {renderInput('Kampanya Başlığı *', 'title', 'Örn: Gazze\'ye Yardım Eli')}
        {renderInput('Açıklama', 'description', 'Kampanya detaylarını ve amacını açıklayın...', 'default', true)}
        
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            {renderInput('Hedef Tutar *', 'targetAmount', '0.00', 'numeric')}
          </View>
          <View style={{ flex: 1 }}>
            {renderInput('Birim', 'unit', 'TL')}
          </View>
        </View>

        {renderInput('Görsel URL', 'imageUrl', 'https://...')}

        {formData.imageUrl ? (
          <View style={styles.previewContainer}>
            <Text style={[styles.label, { color: theme.text2 }]}>Görsel Önizleme</Text>
            <View style={[styles.previewBox, { borderColor: theme.border, backgroundColor: theme.surface }]}>
              <Image 
                source={{ uri: formData.imageUrl }} 
                style={styles.previewImage} 
                resizeMode="cover"
              />
            </View>
          </View>
        ) : (
          <View style={[styles.previewBox, { borderColor: theme.border, backgroundColor: theme.surface, justifyContent: 'center', alignItems: 'center', marginBottom: 20 }]}>
            <Text style={{ fontSize: 40 }}>{formData.title.toLowerCase().includes('hayvan') ? '🐾' : '🎒'}</Text>
          </View>
        )}
        
        <View style={[styles.inputGroup, styles.switchRow]}>
          <View>
            <Text style={[styles.label, { color: theme.text2 }]}>Aktif Mi?</Text>
            <Text style={{ color: theme.text4, fontSize: 12 }}>Kampanya bağış toplanabilir durumda mı?</Text>
          </View>
          <Switch
            value={formData.isActive}
            onValueChange={(val) => setFormData(prev => ({ ...prev, isActive: val }))}
            trackColor={{ false: theme.border, true: theme.accent }}
          />
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: theme.accent }]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.saveButtonText}>{editingCampaign ? 'Güncelle' : 'Oluştur'}</Text>
          )}
        </TouchableOpacity>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 45 : 20,
  },
  backButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 24 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  scrollContent: { padding: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { borderRadius: 15, paddingHorizontal: 15, borderWidth: 1, fontSize: 16 },
  row: { flexDirection: 'row' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, marginTop: 10 },
  saveButton: { height: 55, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginTop: 30, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
  saveButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  previewContainer: { marginBottom: 20 },
  previewBox: { width: '100%', height: 180, borderRadius: 15, borderWidth: 1, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  previewImage: { width: '100%', height: '100%' },
});

export default CampaignEditScreen;
