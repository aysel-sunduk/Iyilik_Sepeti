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

export default function AddCardScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [alias, setAlias] = useState('');

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const matched = cleaned.match(/.{1,4}/g);
    return matched ? matched.join(' ') : cleaned;
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleSaveCard = async () => {
    if (!cardHolder || cardNumber.length < 19 || expiryDate.length < 5 || cvv.length < 3) {
      Alert.alert('Eksik Bilgi', 'Lütfen kart bilgilerini tam ve doğru girdiğinizden emin olun.');
      return;
    }

    try {
      setLoading(true);
      
      const cardData = {
        cardHolderName: cardHolder,
        cardNumber: cardNumber.replace(/\s/g, ''),
        cardAlias: alias || 'Kartım',
        expiryMonth: expiryDate.split('/')[0],
        expiryYear: expiryDate.split('/')[1],
        cvv: cvv,
        isDefault: true
      };

      await api.user.addCard(cardData);
      
      setLoading(false);
      Alert.alert('Başarılı', 'Kartınız güvenli bir şekilde kaydedildi.', [
        { text: 'Tamam', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      setLoading(false);
      Alert.alert('Hata', 'Kart kaydedilirken bir sorun oluştu.');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.bg }]}
    >
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={{fontSize: 24, color: theme.text1}}>←</Text></TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text1 }]}>Yeni Kart Ekle</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Visual Card Representation */}
        <View style={[styles.visualCard, { backgroundColor: theme.accent }]}>
          <View style={styles.cardTop}>
            <Text style={styles.cardType}>CREDIT CARD</Text>
            <View style={styles.chip} />
          </View>
          <Text style={styles.visualCardNumber}>
            {cardNumber || '**** **** **** ****'}
          </Text>
          <View style={styles.cardBottom}>
            <View>
              <Text style={styles.cardLabel}>KART SAHİBİ</Text>
              <Text style={styles.cardValue}>{cardHolder.toUpperCase() || 'AD SOYAD'}</Text>
            </View>
            <View>
              <Text style={styles.cardLabel}>S.K.T</Text>
              <Text style={styles.cardValue}>{expiryDate || 'MM/YY'}</Text>
            </View>
          </View>
        </View>

        {/* Input Fields */}
        <View style={styles.form}>
          <Text style={[styles.inputLabel, { color: theme.text2 }]}>Kart Takma Adı (Örn: Maaş Kartım)</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.border, color: theme.text1, backgroundColor: theme.surface }]}
            placeholder="Maaş Kartım"
            placeholderTextColor={theme.text4}
            value={alias}
            onChangeText={setAlias}
          />

          <Text style={[styles.inputLabel, { color: theme.text2 }]}>Kart Üzerindeki İsim</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.border, color: theme.text1, backgroundColor: theme.surface }]}
            placeholder="AD SOYAD"
            placeholderTextColor={theme.text4}
            value={cardHolder}
            onChangeText={setCardHolder}
            autoCapitalize="characters"
          />

          <Text style={[styles.inputLabel, { color: theme.text2 }]}>Kart Numarası</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.border, color: theme.text1, backgroundColor: theme.surface }]}
            placeholder="0000 0000 0000 0000"
            placeholderTextColor={theme.text4}
            keyboardType="numeric"
            maxLength={19}
            value={cardNumber}
            onChangeText={(text) => setCardNumber(formatCardNumber(text))}
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={[styles.inputLabel, { color: theme.text2 }]}>S.K.T</Text>
              <TextInput
                style={[styles.input, { borderColor: theme.border, color: theme.text1, backgroundColor: theme.surface }]}
                placeholder="AA/YY"
                placeholderTextColor={theme.text4}
                keyboardType="numeric"
                maxLength={5}
                value={expiryDate}
                onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[styles.inputLabel, { color: theme.text2 }]}>CVV</Text>
              <TextInput
                style={[styles.input, { borderColor: theme.border, color: theme.text1, backgroundColor: theme.surface }]}
                placeholder="123"
                placeholderTextColor={theme.text4}
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry
                value={cvv}
                onChangeText={setCvv}
              />
            </View>
          </View>

          <View style={styles.secureNote}>
            <Text style={{fontSize: 16}}>🔒</Text>
            <Text style={[styles.secureText, { color: theme.text3 }]}>
              Kart bilgileriniz 256-bit SSL ile şifrelenerek korunmaktadır.
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.saveBtn, { backgroundColor: theme.accent }]} 
            onPress={handleSaveCard}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="white" /> : <Text style={styles.saveBtnText}>Kartı Kaydet</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  scrollContent: { padding: 20 },
  visualCard: { 
    height: 200, 
    borderRadius: 20, 
    padding: 25, 
    justifyContent: 'space-between',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 30
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardType: { color: 'white', fontSize: 12, fontWeight: 'bold', opacity: 0.8 },
  chip: { width: 45, height: 35, backgroundColor: '#FFD70090', borderRadius: 8 },
  visualCardNumber: { color: 'white', fontSize: 22, fontWeight: 'bold', letterSpacing: 2, textAlign: 'center', marginVertical: 10 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  cardLabel: { color: 'white', fontSize: 10, opacity: 0.7, marginBottom: 4 },
  cardValue: { color: 'white', fontSize: 14, fontWeight: '600' },
  form: { gap: 15 },
  inputLabel: { fontSize: 13, fontWeight: '600', marginLeft: 5 },
  input: { height: 55, borderWidth: 1, borderRadius: 15, paddingHorizontal: 15, fontSize: 16 },
  row: { flexDirection: 'row' },
  secureNote: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 10, paddingHorizontal: 5 },
  secureText: { fontSize: 12, flex: 1 },
  saveBtn: { height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 10, elevation: 2 },
  saveBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});
