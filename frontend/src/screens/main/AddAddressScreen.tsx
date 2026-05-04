import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api/api';

export default function AddAddressScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  
  const [title, setTitle] = useState(''); // Ev, İş vb.
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [fullAddress, setFullAddress] = useState('');

  const validatePhone = (num: string) => {
    const phoneRegex = /^05\d{9}$/;
    return phoneRegex.test(num);
  };

  const handleSaveAddress = async () => {
    // Zorunlu Alan Kontrolleri
    if (!title || !fullName || !phone || !city || !district || !fullAddress) {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm yıldızlı alanları doldurunuz.');
      return;
    }

    // Telefon Format Kontrolü
    if (!validatePhone(phone)) {
      Alert.alert('Hatalı Telefon', 'Telefon numarası 05 ile başlamalı ve 11 hane olmalıdır.');
      return;
    }

    // Adres Detay Kontrolü
    if (fullAddress.length < 10) {
      Alert.alert('Yetersiz Adres', 'Lütfen daha detaylı bir adres giriniz.');
      return;
    }

    try {
      setLoading(true);
      
      // Backend'de AddressService zaten var, oraya bağlanabilir
      const addressData = {
        title,
        fullName,
        phone,
        city,
        district,
        neighborhood,
        fullAddress,
        isDefault: true
      };

      // Simülasyon (Backend hazır olduğunda api.user.addAddress(addressData) kullanılacak)
      setTimeout(() => {
        setLoading(false);
        Alert.alert('Başarılı', 'Adresiniz başarıyla kaydedildi.', [
          { text: 'Tamam', onPress: () => navigation.goBack() }
        ]);
      }, 1200);

    } catch (error) {
      setLoading(false);
      Alert.alert('Hata', 'Adres kaydedilirken bir teknik sorun oluştu.');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.bg }]}
    >
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={{fontSize: 24, color: theme.text1}}>←</Text></TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text1 }]}>Yeni Adres Ekle</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          
          <Text style={[styles.inputLabel, { color: theme.text2 }]}>Adres Başlığı * (Örn: Evim, Ofis)</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.border, color: theme.text1, backgroundColor: theme.surface }]}
            placeholder="Ev, İş, Okul..."
            placeholderTextColor={theme.text4}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={[styles.inputLabel, { color: theme.text2 }]}>Ad Soyad *</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.border, color: theme.text1, backgroundColor: theme.surface }]}
            placeholder="Alıcının Adı Soyadı"
            placeholderTextColor={theme.text4}
            value={fullName}
            onChangeText={setFullName}
          />

          <Text style={[styles.inputLabel, { color: theme.text2 }]}>Telefon Numarası *</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.border, color: theme.text1, backgroundColor: theme.surface }]}
            placeholder="05xxxxxxxxx"
            placeholderTextColor={theme.text4}
            keyboardType="phone-pad"
            maxLength={11}
            value={phone}
            onChangeText={setPhone}
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={[styles.inputLabel, { color: theme.text2 }]}>İl *</Text>
              <TextInput
                style={[styles.input, { borderColor: theme.border, color: theme.text1, backgroundColor: theme.surface }]}
                placeholder="İstanbul"
                placeholderTextColor={theme.text4}
                value={city}
                onChangeText={setCity}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[styles.inputLabel, { color: theme.text2 }]}>İlçe *</Text>
              <TextInput
                style={[styles.input, { borderColor: theme.border, color: theme.text1, backgroundColor: theme.surface }]}
                placeholder="Beşiktaş"
                placeholderTextColor={theme.text4}
                value={district}
                onChangeText={setDistrict}
              />
            </View>
          </View>

          <Text style={[styles.inputLabel, { color: theme.text2 }]}>Mahalle</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.border, color: theme.text1, backgroundColor: theme.surface }]}
            placeholder="Bebek Mah."
            placeholderTextColor={theme.text4}
            value={neighborhood}
            onChangeText={setNeighborhood}
          />

          <Text style={[styles.inputLabel, { color: theme.text2 }]}>Tam Adres *</Text>
          <TextInput
            style={[styles.textArea, { borderColor: theme.border, color: theme.text1, backgroundColor: theme.surface }]}
            placeholder="Cadde, sokak, bina no ve iç kapı no yazınız..."
            placeholderTextColor={theme.text4}
            multiline
            numberOfLines={4}
            value={fullAddress}
            onChangeText={setFullAddress}
          />

          <TouchableOpacity 
            style={[styles.saveBtn, { backgroundColor: theme.accent }]} 
            onPress={handleSaveAddress}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="white" /> : <Text style={styles.saveBtnText}>Adresi Kaydet</Text>}
          </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  scrollContent: { padding: 20 },
  form: { gap: 15 },
  inputLabel: { fontSize: 13, fontWeight: '600', marginLeft: 5 },
  input: { height: 55, borderWidth: 1, borderRadius: 15, paddingHorizontal: 15, fontSize: 16 },
  textArea: { height: 100, borderWidth: 1, borderRadius: 15, paddingHorizontal: 15, paddingTop: 15, fontSize: 16, textAlignVertical: 'top' },
  row: { flexDirection: 'row' },
  saveBtn: { height: 60, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 20, elevation: 4 },
  saveBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});
