import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { clearCart } from '../../redux/slices/cartSlice';

export default function CheckoutScreen({ navigation }: any) {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalAmount = useSelector((state: RootState) => state.cart.totalAmount);
  
  const selfItems = cartItems.filter(item => item.type === 'self');
  const donationItems = cartItems.filter(item => item.type === 'donation');

  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet'>('card');
  const [isRoundUp, setIsRoundUp] = useState(false);
  const [isGift, setIsGift] = useState(false);
  const [friendName, setFriendName] = useState('');

  const shippingFee = selfItems.length > 0 ? 30 : 0;
  const subTotal = totalAmount + shippingFee;
  const roundedTotal = Math.ceil(subTotal / 5) * 5; // En yakın 5'e yuvarla
  const roundUpAmount = roundedTotal - subTotal;
  const finalTotal = isRoundUp ? roundedTotal : subTotal;

  const handlePlaceOrder = () => {
    if (selfItems.length > 0 && (!name || !phone || !address)) {
      Alert.alert('Eksik Bilgi', 'Lütfen teslimat adresi bilgilerini doldurun.');
      return;
    }

    if (isGift && !friendName) {
      Alert.alert('Eksik Bilgi', 'Lütfen hediye edilecek arkadaşınızın adını yazın.');
      return;
    }

    Alert.alert(
      'İşlem Başarılı! 🎉',
      isGift 
        ? `${friendName} adına hazırlanan dijital sertifika yola çıktı! Bağışlarınız ulaştığında size de bildirim gelecek.`
        : 'Siparişiniz alındı ve bağışlarınız yola çıktı. İyilik puanlarınız eklendi!',
      [
        {
          text: 'Harika!',
          onPress: () => {
            dispatch(clearCart());
            navigation.replace('Home');
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={{fontSize: 24, color: theme.text1}}>←</Text></TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text1 }]}>Güvenli Ödeme</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Order Summary */}
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.text1 }]}>📋 Sipariş Özeti</Text>
          {selfItems.length > 0 && (
            <View style={styles.summaryGroup}>
              <Text style={[styles.groupLabel, { color: '#3B82F6' }]}>📦 Senin İçin ({selfItems.length} Ürün)</Text>
              {selfItems.map(item => (
                <Text key={item.id} style={[styles.summaryItem, { color: theme.text2 }]}>• {item.name} (x{item.quantity})</Text>
              ))}
            </View>
          )}
          {donationItems.length > 0 && (
            <View style={styles.summaryGroup}>
              <Text style={[styles.groupLabel, { color: '#10B981' }]}>🙏 Bağışların ({donationItems.length} Ürün)</Text>
              {donationItems.map(item => (
                <Text key={item.id} style={[styles.summaryItem, { color: theme.text2 }]}>• {item.name} (x{item.quantity})</Text>
              ))}
            </View>
          )}
          <View style={styles.divider} />
          
          {/* İyilik Dokunuşu Section */}
          <View style={[styles.roundUpContainer, { backgroundColor: theme.accent + '08', borderColor: theme.accent + '30' }]}>
            <View style={styles.roundUpRow}>
              <View style={{flex: 1}}>
                <Text style={[styles.roundUpTitle, { color: theme.text1 }]}>Küsuratı Tamamla 🪙</Text>
                <Text style={[styles.roundUpSub, { color: theme.text3 }]}>₺{roundUpAmount.toFixed(2)} farkı sokak hayvanları fonuna aktar.</Text>
              </View>
              <TouchableOpacity 
                onPress={() => setIsRoundUp(!isRoundUp)}
                style={[styles.toggle, { backgroundColor: isRoundUp ? theme.accent : '#D1D5DB' }]}
              >
                <View style={[styles.toggleCircle, { transform: [{ translateX: isRoundUp ? 20 : 2 }] }]} />
              </TouchableOpacity>
            </View>

            {donationItems.length > 0 && (
              <View style={[styles.roundUpRow, { marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: theme.border + '30' }]}>
                <View style={{flex: 1}}>
                  <Text style={[styles.roundUpTitle, { color: theme.text1 }]}>Arkadaşına Hediye Et 🎁</Text>
                  <Text style={[styles.roundUpSub, { color: theme.text3 }]}>Onun adına dijital sertifika hazırlayalım.</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => setIsGift(!isGift)}
                  style={[styles.toggle, { backgroundColor: isGift ? theme.accent : '#D1D5DB' }]}
                >
                  <View style={[styles.toggleCircle, { transform: [{ translateX: isGift ? 20 : 2 }] }]} />
                </TouchableOpacity>
              </View>
            )}

            {isGift && (
              <TextInput
                style={[styles.input, { borderColor: theme.accent + '50', marginTop: 10, backgroundColor: 'white' }]}
                placeholder="Arkadaşının Adı Soyadı"
                value={friendName}
                onChangeText={setFriendName}
              />
            )}
          </View>

          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: theme.text1 }]}>Ödenecek Toplam</Text>
            <Text style={[styles.totalPrice, { color: theme.accent }]}>₺{finalTotal.toLocaleString()}</Text>
          </View>
        </View>

        {/* Delivery Address (Only if self items exist) */}
        {selfItems.length > 0 && (
          <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <Text style={[styles.cardTitle, { color: theme.text1 }]}>📍 Teslimat Adresi</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.border, color: theme.text1 }]}
              placeholder="Ad Soyad"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={[styles.input, { borderColor: theme.border, color: theme.text1, marginTop: 10 }]}
              placeholder="Telefon"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
            <TextInput
              style={[styles.textArea, { borderColor: theme.border, color: theme.text1, marginTop: 10 }]}
              placeholder="Tam Adresiniz..."
              multiline
              numberOfLines={3}
              value={address}
              onChangeText={setAddress}
            />
          </View>
        )}

        {/* Payment Methods */}
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.text1 }]}>💳 Ödeme Yöntemi</Text>
          <TouchableOpacity 
            style={[styles.paymentOption, paymentMethod === 'card' && { borderColor: theme.accent, backgroundColor: theme.accent + '05' }]}
            onPress={() => setPaymentMethod('card')}
          >
            <Text style={{fontSize: 24}}>💳</Text>
            <Text style={[styles.paymentText, { color: theme.text1 }]}>Kredi / Banka Kartı</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.paymentOption, paymentMethod === 'wallet' && { borderColor: theme.accent, backgroundColor: theme.accent + '05' }]}
            onPress={() => setPaymentMethod('wallet')}
          >
            <Text style={{fontSize: 24}}>💰</Text>
            <Text style={[styles.paymentText, { color: theme.text1 }]}>İyilik Cüzdanım</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.orderBtn, { backgroundColor: theme.accent }]} onPress={handlePlaceOrder}>
          <Text style={styles.orderBtnText}>Ödemeyi Tamamla →</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  scrollContent: { padding: 20 },
  card: { padding: 20, borderRadius: 24, marginBottom: 20, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  summaryGroup: { marginBottom: 12 },
  groupLabel: { fontSize: 12, fontWeight: 'bold', marginBottom: 5 },
  summaryItem: { fontSize: 14, marginLeft: 10, marginBottom: 2 },
  divider: { height: 1, backgroundColor: '#00000005', marginVertical: 15 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 15, fontWeight: 'bold' },
  totalPrice: { fontSize: 22, fontWeight: 'bold' },
  input: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 15 },
  textArea: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 15, minHeight: 80, textAlignVertical: 'top' },
  donationInfoCard: { padding: 20, borderRadius: 24, borderWidth: 1, marginBottom: 20, borderStyle: 'dashed' },
  donationDesc: { fontSize: 13, lineHeight: 20 },
  paymentOption: { flexDirection: 'row', alignItems: 'center', gap: 15, padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#00000010', marginBottom: 10 },
  paymentText: { fontSize: 15, fontWeight: '500' },
  orderBtn: { paddingVertical: 18, borderRadius: 20, alignItems: 'center', elevation: 4 },
  orderBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  roundUpContainer: { padding: 15, borderRadius: 18, marginBottom: 20, borderWidth: 1 },
  roundUpRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  roundUpTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 2 },
  roundUpSub: { fontSize: 12, lineHeight: 16 },
  toggle: { width: 44, height: 24, borderRadius: 12, padding: 2, justifyContent: 'center' },
  toggleCircle: { width: 20, height: 20, borderRadius: 10, backgroundColor: 'white', elevation: 2 }
});