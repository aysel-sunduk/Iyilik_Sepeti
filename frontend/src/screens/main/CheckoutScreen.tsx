import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { clearCart } from '../../redux/slices/cartSlice';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api/api';

export default function CheckoutScreen({ navigation }: any) {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { refreshUser } = useAuth();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalAmount = useSelector((state: RootState) => state.cart.totalAmount);

  const selfItems = cartItems.filter(item => item.type === 'self');
  const donationItems = cartItems.filter(item => item.type === 'donation');

  const [addresses, setAddresses] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
   const [loading, setLoading] = useState(false);
   const [fetchingData, setFetchingData] = useState(true);
   const [isRoundUp, setIsRoundUp] = useState(false);
   const [isGift, setIsGift] = useState(false);
   const [friendName, setFriendName] = useState('');
   const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet'>('card');

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setFetchingData(true);
      const [addrList, cardList] = await Promise.all([
        api.user.getAddresses(),
        api.user.getCards()
      ]);
      setAddresses(addrList);
      setCards(cardList);
      
      // Select default or first one
      if (addrList.length > 0) {
        const def = addrList.find(a => a.isDefault) || addrList[0];
        setSelectedAddressId(def.id);
      }
      if (cardList.length > 0) {
        const def = cardList.find(c => c.isDefault) || cardList[0];
        setSelectedCardId(def.id);
      }
    } catch (error) {
      console.error('Data loading error:', error);
    } finally {
      setFetchingData(false);
    }
  };

  const shippingFee = selfItems.length > 0 ? 30 : 0;
  const subTotal = totalAmount + shippingFee;
  const roundedTotal = Math.ceil(subTotal / 5) * 5;
  const roundUpAmount = roundedTotal - subTotal;
  const finalTotal = isRoundUp ? roundedTotal : subTotal;

  const validatePhone = (num: string) => {
    const phoneRegex = /^05\d{9}$/;
    return phoneRegex.test(num);
  };

  const handlePlaceOrder = async () => {
    // 1. Adres Validasyonu
    if (!selectedAddressId) {
      Alert.alert('Eksik Bilgi', 'Lütfen bir fatura/teslimat adresi seçin.');
      return;
    }

    // 2. Ödeme Validasyonu
    if (paymentMethod === 'card' && !selectedCardId) {
      Alert.alert(
        'Kart Seçilmedi',
        'Lütfen bir ödeme kartı seçin veya yeni bir kart ekleyin.',
        [
          { text: 'Kart Ekle', onPress: () => navigation.navigate('AddCard') },
          { text: 'İptal', style: 'cancel' }
        ]
      );
      return;
    }

    if (isGift && !friendName) {
      Alert.alert('Eksik Bilgi', 'Lütfen hediye edilecek arkadaşınızın adını yazın.');
      return;
    }

    try {
      setLoading(true);

      // 3. Veriyi Backend Formatına Hazırla
      let finalOrderType = isGift ? "GIFT" : "PERSONAL";
      let finalReceiverName = isGift ? friendName : (addresses.find(a => a.id === selectedAddressId)?.fullName || "");
      let finalGiftMessage = isGift ? "Senin adına iyilik yaptık! 🎁" : "";

      const donationWithCert = donationItems.find(item => item.donorName);
      if (donationWithCert) {
         finalOrderType = "GIFT";
         finalReceiverName = donationWithCert.donorName || "";
         finalGiftMessage = donationWithCert.message || "";
      }

      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity
        })),
        shippingAddressId: selectedAddressId,
        paymentMethod: paymentMethod === 'wallet' ? 'WALLET' : 'CREDIT_CARD',
        paymentCardId: paymentMethod === 'card' ? selectedCardId : null,
        orderType: finalOrderType,
        receiverName: finalReceiverName,
        giftMessage: finalGiftMessage,
        roundUpAmount: isRoundUp ? roundUpAmount : 0.0 // Backend'e bağış miktarını gönderiyoruz
      };

      // 4. API Çağrısı
      await api.orders.create(orderData);
      
      try {
        await refreshUser();
      } catch (err) {
        console.warn('Failed to refresh user stats after order:', err);
      }

      Alert.alert('İşlem Başarılı! 🎉', isGift ? 'Hediye bağışınız başarıyla iletildi. İyilik paylaştıkça çoğalır! ✨' : 'Siparişiniz başarıyla alındı. Keyifli günler dileriz! 🌟');
      dispatch(clearCart());
      navigation.navigate('MainTabs');

    } catch (error: any) {
      console.error('Sipariş hatası:', error);
      const errorMsg = error.message || 'Sipariş oluşturulurken bir sorun oluştu.';
      Alert.alert('Hata', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={{ fontSize: 24, color: theme.text1 }}>←</Text></TouchableOpacity>
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
              <View style={{ flex: 1 }}>
                <Text style={[styles.roundUpTitle, { color: theme.text1 }]}>Küsuratı İyiliğe Biriktir 🪙</Text>
                <Text style={[styles.roundUpSub, { color: theme.text3 }]}>₺{roundUpAmount.toFixed(2)} farkı iyilik cüzdanına ekle, sonra bağışla.</Text>
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
                <View style={{ flex: 1 }}>
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
                style={[styles.input, { borderColor: theme.accent + '50', marginTop: 10, backgroundColor: theme.isDark ? theme.bg : '#F3F4F6', color: theme.text1 }]}
                placeholder="Arkadaşının Adı Soyadı"
                placeholderTextColor={theme.text4}
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

        {/* Delivery Address Section */}
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.text1 }]}>📍 Fatura / Teslimat Adresi</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AddAddress')}>
              <Text style={{ color: theme.accent, fontWeight: 'bold' }}>+ Yeni Ekle</Text>
            </TouchableOpacity>
          </View>
            
            {fetchingData ? (
              <ActivityIndicator color={theme.accent} />
            ) : addresses.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
                {addresses.map(addr => (
                  <TouchableOpacity 
                    key={addr.id}
                    onPress={() => setSelectedAddressId(addr.id)}
                    style={[
                      styles.addressOption, 
                      { borderColor: selectedAddressId === addr.id ? theme.accent : theme.border }
                    ]}
                  >
                    <Text style={[styles.addressTitle, { color: theme.text1 }]}>{addr.title}</Text>
                    <Text style={[styles.addressText, { color: theme.text3 }]} numberOfLines={2}>
                      {addr.addressLine}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <Text style={{ color: theme.text3, marginTop: 10 }}>Henüz bir adres eklemediniz.</Text>
            )}
        </View>

        {/* Payment Methods */}
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.text1 }]}>💳 Ödeme Yöntemi</Text>
          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === 'card' && { borderColor: theme.accent, backgroundColor: theme.accent + '05' }]}
            onPress={() => setPaymentMethod('card')}
          >
            <Text style={{ fontSize: 24 }}>💳</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.paymentText, { color: theme.text1 }]}>Kredi / Banka Kartı</Text>
              {paymentMethod === 'card' && cards.length > 0 && (
                <Text style={{ fontSize: 12, color: theme.text3 }}>{cards.find(c => c.id === selectedCardId)?.cardAlias || 'Kart Seçin'}</Text>
              )}
            </View>
          </TouchableOpacity>

          {paymentMethod === 'card' && cards.length > 0 && (
             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15, paddingLeft: 10 }}>
               {cards.map(card => (
                 <TouchableOpacity 
                   key={card.id}
                   onPress={() => setSelectedCardId(card.id)}
                   style={[
                     styles.cardOption,
                     { borderColor: selectedCardId === card.id ? theme.accent : theme.border }
                   ]}
                 >
                   <Text style={{ fontSize: 12, color: theme.text1, fontWeight: 'bold' }}>{card.cardAlias}</Text>
                   <Text style={{ fontSize: 10, color: theme.text3 }}>**** {card.cardNumberLastFour}</Text>
                 </TouchableOpacity>
               ))}
               <TouchableOpacity 
                  onPress={() => navigation.navigate('AddCard')}
                  style={[styles.cardOption, { borderStyle: 'dashed', borderColor: theme.border }]}
               >
                 <Text style={{ fontSize: 18, color: theme.text4 }}>+</Text>
               </TouchableOpacity>
             </ScrollView>
          )}

          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === 'wallet' && { borderColor: theme.accent, backgroundColor: theme.accent + '05' }]}
            onPress={() => setPaymentMethod('wallet')}
          >
            <Text style={{ fontSize: 24 }}>💰</Text>
            <Text style={[styles.paymentText, { color: theme.text1 }]}>İyilik Cüzdanım</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.orderBtn, { backgroundColor: theme.accent, opacity: loading ? 0.7 : 1 }]}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.orderBtnText}>Ödemeyi Tamamla →</Text>
          )}
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  addressOption: { width: 150, padding: 15, borderRadius: 16, borderWidth: 2, marginRight: 12 },
  addressTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 5 },
  addressText: { fontSize: 12, lineHeight: 16 },
  cardOption: { padding: 12, borderRadius: 12, borderWidth: 2, marginRight: 10, minWidth: 100, alignItems: 'center', justifyContent: 'center' },
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