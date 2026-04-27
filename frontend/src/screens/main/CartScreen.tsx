import React from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import { clearCart, removeFromCart, updateQuantity } from '../../redux/slices/cartSlice';
import { RootState } from '../../redux/store';

export default function CartScreen({ navigation }: any) {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalAmount = useSelector((state: RootState) => state.cart.totalAmount);

  const handleRemove = (id: number) => {
    Alert.alert('Ürün Kaldır', 'Ürünü sepetten kaldırmak istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Kaldır', onPress: () => dispatch(removeFromCart(id)) }
    ]);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Sepet Boş', 'Sepetinizde ürün bulunmamaktadır.');
      return;
    }
    navigation.navigate('Checkout');
  };

  if (cartItems.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.bg }]}>
        <Text style={{ fontSize: 64, marginBottom: 20 }}>🛒</Text>
        <Text style={[styles.emptyText, { color: theme.text2 }]}>Sepetiniz boş</Text>
        <TouchableOpacity style={[styles.shopBtn, { backgroundColor: theme.accent }]} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.shopBtnText}>Alışverişe Başla</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 24 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text1 }]}>Sepetim ({cartItems.length})</Text>
        <TouchableOpacity onPress={() => dispatch(clearCart())}>
          <Text style={[styles.clearText, { color: theme.accent }]}>Temizle</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.cartItem, { backgroundColor: theme.surface }]}>
            <Text style={{ fontSize: 48 }}>{item.image}</Text>
            <View style={styles.itemInfo}>
              <Text style={[styles.itemName, { color: theme.text1 }]}>{item.name}</Text>
              <Text style={[styles.itemPrice, { color: theme.accent }]}>₺{item.price}</Text>
              <Text style={[styles.itemSeller, { color: theme.text4 }]}>{item.seller}</Text>
            </View>
            <View style={styles.itemActions}>
              <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))}>
                  <Text style={styles.quantityBtn}>-</Text>
                </TouchableOpacity>
                <Text style={[styles.quantity, { color: theme.text1 }]}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}>
                  <Text style={styles.quantityBtn}>+</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => handleRemove(item.id)}>
                <Text style={{ fontSize: 20 }}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <View style={[styles.footer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: theme.text2 }]}>Toplam:</Text>
          <Text style={[styles.totalPrice, { color: theme.accent }]}>₺{totalAmount.toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={[styles.checkoutBtn, { backgroundColor: theme.accent }]} onPress={handleCheckout}>
          <Text style={styles.checkoutBtnText}>Ödemeye Geç →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, marginBottom: 20 },
  shopBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25 },
  shopBtnText: { color: 'white', fontWeight: 'bold' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  clearText: { fontSize: 14 },
  list: { padding: 16 },
  cartItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 12, gap: 16 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  itemPrice: { fontSize: 14, fontWeight: 'bold', marginBottom: 2 },
  itemSeller: { fontSize: 12 },
  itemActions: { alignItems: 'flex-end', gap: 8 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  quantityBtn: { fontSize: 20, fontWeight: 'bold', paddingHorizontal: 8 },
  quantity: { fontSize: 16, fontWeight: '600', minWidth: 30, textAlign: 'center' },
  footer: { padding: 20, borderTopWidth: 1, paddingBottom: 30 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  totalLabel: { fontSize: 18 },
  totalPrice: { fontSize: 22, fontWeight: 'bold' },
  checkoutBtn: { paddingVertical: 16, borderRadius: 30, alignItems: 'center' },
  checkoutBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});