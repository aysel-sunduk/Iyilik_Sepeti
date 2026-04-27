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
  
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  const handlePlaceOrder = () => {
    if (!name || !phone || !address) {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm alanları doldurun.');
      return;
    }

    Alert.alert(
      'Siparişiniz Alındı! 🎉',
      `Siparişiniz başarıyla oluşturuldu. ${address} adresine kargolanacaktır.`,
      [
        {
          text: 'Ana Sayfaya Dön',
          onPress: () => {
            dispatch(clearCart());
            navigation.replace('Home');
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 24 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text1 }]}>Ödeme</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Text style={[styles.cardTitle, { color: theme.text1 }]}>📦 Sipariş Özeti</Text>
        {cartItems.map((item) => (
          <View key={item.id} style={styles.orderRow}>
            <Text style={[styles.orderText, { color: theme.text2 }]}>{item.name} x{item.quantity}</Text>
            <Text style={[styles.orderPrice, { color: theme.accent }]}>₺{item.price * item.quantity}</Text>
          </View>
        ))}
        <View style={styles.divider} />
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: theme.text1 }]}>Toplam</Text>
          <Text style={[styles.totalPrice, { color: theme.accent }]}>₺{totalAmount.toLocaleString()}</Text>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Text style={[styles.cardTitle, { color: theme.text1 }]}>📍 Teslimat Bilgileri</Text>
        
        <Text style={[styles.inputLabel, { color: theme.text3 }]}>Ad Soyad</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.bg, borderColor: theme.border, color: theme.text1 }]}
          placeholder="Ahmet Yılmaz"
          placeholderTextColor={theme.text4}
          value={name}
          onChangeText={setName}
        />

        <Text style={[styles.inputLabel, { color: theme.text3 }]}>Telefon</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.bg, borderColor: theme.border, color: theme.text1 }]}
          placeholder="05XX XXX XX XX"
          placeholderTextColor={theme.text4}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <Text style={[styles.inputLabel, { color: theme.text3 }]}>Adres</Text>
        <TextInput
          style={[styles.textArea, { backgroundColor: theme.bg, borderColor: theme.border, color: theme.text1 }]}
          placeholder="Ev Adresiniz..."
          placeholderTextColor={theme.text4}
          multiline
          numberOfLines={3}
          value={address}
          onChangeText={setAddress}
        />
      </View>

      <TouchableOpacity style={[styles.orderBtn, { backgroundColor: theme.accent }]} onPress={handlePlaceOrder}>
        <Text style={styles.orderBtnText}>Siparişi Tamamla →</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 40 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  card: { padding: 20, borderRadius: 20, marginBottom: 20 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  orderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  orderText: { fontSize: 14 },
  orderPrice: { fontSize: 14, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 12 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  totalLabel: { fontSize: 16, fontWeight: '600' },
  totalPrice: { fontSize: 18, fontWeight: 'bold' },
  inputLabel: { fontSize: 14, marginBottom: 8, marginTop: 12 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
  textArea: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, minHeight: 80, textAlignVertical: 'top' },
  orderBtn: { paddingVertical: 16, borderRadius: 30, alignItems: 'center', marginTop: 10 },
  orderBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});