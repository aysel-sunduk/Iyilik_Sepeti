import React from 'react';
import { Alert, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import { clearCart, removeFromCart, updateQuantity } from '../../redux/slices/cartSlice';
import { RootState } from '../../redux/store';

export default function CartScreen({ navigation }: any) {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalAmount = useSelector((state: RootState) => state.cart.totalAmount);

  const selfItems = cartItems.filter(item => item.type === 'self');
  const donationItems = cartItems.filter(item => item.type === 'donation');

  const handleRemove = (id: number | string, type: 'self' | 'donation') => {
    Alert.alert('Ürün Kaldır', 'Ürünü sepetten kaldırmak istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Kaldır', onPress: () => dispatch(removeFromCart({ id, type })) }
    ]);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Sepet Boş', 'Sepetinizde ürün bulunmamaktadır.');
      return;
    }
    navigation.navigate('Checkout');
  };

  const renderItem = (item: any) => (
    <View style={[styles.cartItem, { backgroundColor: theme.surface }]}>
      <View style={[styles.itemImageContainer, { backgroundColor: item.type === 'self' ? '#3B82F615' : '#10B98115' }]}>
        <Text style={{ fontSize: 32 }}>{item.image}</Text>
      </View>
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: theme.text1 }]}>{item.name}</Text>
        <Text style={[styles.itemType, { color: item.type === 'self' ? '#3B82F6' : '#10B981' }]}>
          {item.type === 'self' ? '👤 KENDİM İÇİN' : '🙏 BAĞIŞ ÜRÜNÜ'}
        </Text>
        <Text style={[styles.itemPrice, { color: theme.accent }]}>₺{item.price}</Text>
      </View>
      <View style={styles.itemActions}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => dispatch(updateQuantity({ id: item.id, type: item.type, quantity: Math.max(1, item.quantity - 1) }))}>
            <Text style={[styles.quantityBtn, { color: theme.accent }]}>−</Text>
          </TouchableOpacity>
          <Text style={[styles.quantity, { color: theme.text1 }]}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => dispatch(updateQuantity({ id: item.id, type: item.type, quantity: item.quantity + 1 }))}>
            <Text style={[styles.quantityBtn, { color: theme.accent }]}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => handleRemove(item.id, item.type)}>
          <Text style={{ fontSize: 18 }}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.bg }]}>
        <Text style={{ fontSize: 80, marginBottom: 20 }}>🛒</Text>
        <Text style={[styles.emptyText, { color: theme.text2, fontWeight: 'bold', fontSize: 20 }]}>Sepetiniz boş</Text>
        <TouchableOpacity style={[styles.shopBtn, { backgroundColor: theme.accent }]} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.shopBtnText}>Alışverişe Başla</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ fontSize: 24, color: theme.text1 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text1 }]}>🛒 SEPETİM</Text>
        <TouchableOpacity onPress={() => dispatch(clearCart())}>
          <Text style={[styles.clearText, { color: theme.error }]}>Hepsini Sil</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.list}>
        {selfItems.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text1 }]}>👤 KENDİM İÇİN</Text>
              <View style={[styles.sectionBadge, { backgroundColor: '#3B82F620' }]}>
                <Text style={{ color: '#3B82F6', fontWeight: 'bold' }}>{selfItems.length}</Text>
              </View>
            </View>
            {selfItems.map(item => (
              <View key={`${item.id}-${item.type}`}>
                {renderItem(item)}
              </View>
            ))}
          </View>
        )}

        {donationItems.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text1 }]}>🙏 BAĞIŞ YAPTIĞIM ÜRÜNLER</Text>
              <View style={[styles.sectionBadge, { backgroundColor: '#10B98120' }]}>
                <Text style={{ color: '#10B981', fontWeight: 'bold' }}>{donationItems.length}</Text>
              </View>
            </View>
            {donationItems.map(item => (
              <View key={`${item.id}-${item.type}`}>
                {renderItem(item)}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        <Text style={[styles.summaryTitle, { color: theme.text1 }]}>⭐ ÖZET</Text>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: theme.text2 }]}>Ara Toplam:</Text>
          <Text style={[styles.totalValue, { color: theme.text1 }]}>₺{totalAmount.toLocaleString()}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: theme.text2 }]}>Kargo:</Text>
          <Text style={[styles.totalValue, { color: theme.text1 }]}>₺30</Text>
        </View>
        <View style={[styles.totalRow, styles.grandTotalRow]}>
          <Text style={[styles.grandTotalLabel, { color: theme.text1 }]}>TOPLAM:</Text>
          <Text style={[styles.grandTotalPrice, { color: theme.accent }]}>₺{(totalAmount + 30).toLocaleString()}</Text>
        </View>

        <TouchableOpacity style={[styles.checkoutBtn, { backgroundColor: theme.accent }]} onPress={handleCheckout}>
          <Text style={styles.checkoutBtnText}>Ödemeye Geç →</Text>
        </TouchableOpacity>
        
        {selfItems.length > 0 && donationItems.length > 0 && (
          <TouchableOpacity style={styles.secondaryCheckoutBtn} onPress={handleCheckout}>
            <Text style={[styles.secondaryCheckoutText, { color: theme.text3 }]}>Sadece Satın Al (Bağışları Sonra Yap)</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 18, marginBottom: 20, textAlign: 'center' },
  shopBtn: { paddingHorizontal: 30, paddingVertical: 15, borderRadius: 30, elevation: 3 },
  shopBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 60, 
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4
  },
  backBtn: { width: 40 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  clearText: { fontSize: 12, fontWeight: 'bold' },
  list: { padding: 16 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', letterSpacing: 1 },
  sectionBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  cartItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 12, 
    borderRadius: 20, 
    marginBottom: 10, 
    gap: 12,
    elevation: 2
  },
  itemImageContainer: { width: 70, height: 70, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: 'bold', marginBottom: 2 },
  itemType: { fontSize: 10, fontWeight: 'bold', marginBottom: 4 },
  itemPrice: { fontSize: 16, fontWeight: 'bold' },
  itemActions: { alignItems: 'flex-end', gap: 10 },
  quantityContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#00000005', 
    borderRadius: 12,
    paddingHorizontal: 4
  },
  quantityBtn: { fontSize: 24, fontWeight: 'bold', paddingHorizontal: 10 },
  quantity: { fontSize: 15, fontWeight: 'bold', minWidth: 25, textAlign: 'center' },
  footer: { 
    padding: 20, 
    borderTopWidth: 1, 
    paddingBottom: 40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 10
  },
  summaryTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  totalLabel: { fontSize: 14 },
  totalValue: { fontSize: 14, fontWeight: '600' },
  grandTotalRow: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#00000010', marginBottom: 20 },
  grandTotalLabel: { fontSize: 16, fontWeight: 'bold' },
  grandTotalPrice: { fontSize: 22, fontWeight: 'bold' },
  checkoutBtn: { paddingVertical: 16, borderRadius: 16, alignItems: 'center', elevation: 4 },
  checkoutBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  secondaryCheckoutBtn: { marginTop: 15, alignItems: 'center' },
  secondaryCheckoutText: { fontSize: 13, textDecorationLine: 'underline' }
});