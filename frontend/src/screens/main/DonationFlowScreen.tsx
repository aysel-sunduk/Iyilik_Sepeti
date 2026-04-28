import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';

const { width } = Dimensions.get('window');

export default function DonationFlowScreen({ route, navigation }: any) {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { product, campaign, isCampaign } = route.params;
  
  const [quantity, setQuantity] = useState(1);
  const [donorName, setDonorName] = useState('');
  const [message, setMessage] = useState('');
  const [showCertificate, setShowCertificate] = useState(true);

  const targetName = isCampaign ? campaign.title : product.name;
  const targetPrice = isCampaign ? 100 : product.price; // Kampanyalar için default 100 TL birim bağış

  const handleComplete = () => {
    if (!donorName.trim()) {
      Alert.alert('Uyarı', 'Sertifika için lütfen adınızı girin');
      return;
    }

    dispatch(addToCart({
      id: isCampaign ? campaign.id : product.id,
      name: targetName,
      price: targetPrice,
      image: isCampaign ? (campaign.title.includes('Hayvan') ? '🐾' : '🎒') : (product.imageUrl || '🎁'),
      seller: isCampaign ? 'Bağış Kampanyası' : product.category,
      quantity: quantity,
      type: 'donation'
    }));

    Alert.alert(
      'Harika! 🌟',
      `Bağışınız sepete eklendi. Bu işlemden +${quantity * 10} İyilik Puanı kazanacaksın!`,
      [
        { text: 'Devam Et', onPress: () => navigation.navigate('Cart') }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={{fontSize: 24}}>←</Text></TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text1 }]}>Bağış Detayları</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Step 1: Amount */}
        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.text1 }]}>🎁 Bağış Miktarı</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))} style={styles.qBtn}>
              <Text style={[styles.qBtnText, { color: theme.accent }]}>−</Text>
            </TouchableOpacity>
            <View style={styles.qDisplay}>
              <Text style={[styles.qValue, { color: theme.text1 }]}>{quantity}</Text>
              <Text style={[styles.qUnit, { color: theme.text3 }]}>{isCampaign ? campaign.unit : 'Adet'}</Text>
            </View>
            <TouchableOpacity onPress={() => setQuantity(quantity + 1)} style={styles.qBtn}>
              <Text style={[styles.qBtnText, { color: theme.accent }]}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.priceRow}>
            <Text style={[styles.totalLabel, { color: theme.text2 }]}>Toplam Bağış:</Text>
            <Text style={[styles.totalValue, { color: theme.accent }]}>₺{(quantity * targetPrice).toLocaleString()}</Text>
          </View>
        </View>

        {/* Step 2: Information */}
        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.text1 }]}>✍️ Sertifika Bilgileri</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.border, color: theme.text1 }]}
            placeholder="Sertifikada görünecek adınız"
            placeholderTextColor={theme.text4}
            value={donorName}
            onChangeText={setDonorName}
          />
          <TextInput
            style={[styles.textArea, { borderColor: theme.border, color: theme.text1 }]}
            placeholder="İyilik mesajınız (İsteğe bağlı)"
            placeholderTextColor={theme.text4}
            multiline
            numberOfLines={3}
            value={message}
            onChangeText={setMessage}
          />
        </View>

        {/* Step 3: Certificate Preview */}
        {showCertificate && (
          <View style={styles.certificateContainer}>
            <Text style={[styles.sectionTitle, { color: theme.text1, marginLeft: 10 }]}>📄 Sertifika Önizleme</Text>
            <View style={[styles.certificate, { backgroundColor: '#FDFCF0', borderColor: '#E5C100' }]}>
              <View style={styles.certHeader}>
                <Text style={styles.certLogo}>🌿 İYİLİK SEPETİ</Text>
                <Text style={styles.certTitle}>TEŞEKKÜR BELGESİ</Text>
              </View>
              <View style={styles.certContent}>
                <Text style={styles.certText}>Sayın</Text>
                <Text style={styles.certName}>{donorName || '....................'}</Text>
                <Text style={styles.certDesc}>
                  Yaptığınız bu anlamlı bağış ile <Text style={{fontWeight: 'bold'}}>{quantity} {isCampaign ? campaign.unit : 'adet'} {targetName}</Text> ihtiyacı olan ellere ulaştırılmıştır.
                </Text>
              </View>
              <View style={styles.certFooter}>
                <Text style={styles.certDate}>{new Date().toLocaleDateString('tr-TR')}</Text>
                <View style={styles.certSeal}><Text style={{fontSize: 20}}>🏆</Text></View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        <View style={styles.pointsInfo}>
          <Text style={{fontSize: 18}}>⭐</Text>
          <Text style={[styles.pointsText, { color: theme.text2 }]}>Bu bağıştan <Text style={{color: theme.accent, fontWeight: 'bold'}}>+{quantity * 10} Puan</Text> kazanacaksın.</Text>
        </View>
        <TouchableOpacity style={[styles.completeBtn, { backgroundColor: theme.accent }]} onPress={handleComplete}>
          <Text style={styles.completeBtnText}>Bağışı Sepete Ekle →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  scrollContent: { padding: 20 },
  section: { padding: 20, borderRadius: 24, marginBottom: 20, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 20 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  qBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#00000005', justifyContent: 'center', alignItems: 'center' },
  qBtnText: { fontSize: 30, fontWeight: 'bold' },
  qDisplay: { alignItems: 'center' },
  qValue: { fontSize: 32, fontWeight: 'bold' },
  qUnit: { fontSize: 14 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15, borderTopWidth: 1, borderTopColor: '#00000005' },
  totalLabel: { fontSize: 16 },
  totalValue: { fontSize: 24, fontWeight: 'bold' },
  input: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 12, fontSize: 16 },
  textArea: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 16, minHeight: 80, textAlignVertical: 'top' },
  certificateContainer: { marginBottom: 30 },
  certificate: { 
    marginTop: 15, 
    padding: 25, 
    borderRadius: 15, 
    borderWidth: 8, 
    minHeight: 250,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10
  },
  certHeader: { alignItems: 'center', marginBottom: 20 },
  certLogo: { fontSize: 12, fontWeight: 'bold', color: '#10B981', letterSpacing: 2 },
  certTitle: { fontSize: 18, fontWeight: '900', color: '#B8860B', marginTop: 5 },
  certContent: { alignItems: 'center', marginBottom: 20 },
  certText: { fontSize: 12, color: '#666' },
  certName: { fontSize: 22, fontWeight: 'bold', color: '#333', marginVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ccc', minWidth: 150, textAlign: 'center' },
  certDesc: { fontSize: 14, textAlign: 'center', color: '#444', lineHeight: 22 },
  certFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  certDate: { fontSize: 10, color: '#999' },
  certSeal: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFD70030', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#FFD700' },
  footer: { padding: 20, borderTopWidth: 1, paddingBottom: 40 },
  pointsInfo: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15, justifyContent: 'center' },
  pointsText: { fontSize: 14 },
  completeBtn: { paddingVertical: 18, borderRadius: 20, alignItems: 'center', elevation: 4 },
  completeBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});