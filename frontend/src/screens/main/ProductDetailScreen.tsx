import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, syncCartItem } from '../../redux/slices/cartSlice';
import { AppDispatch, RootState } from '../../redux/store';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen({ route, navigation }: any) {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
   const { product } = route.params;
   const cartItems = useSelector((state: RootState) => state.cart.items);
   const [quantity, setQuantity] = useState(1);

  const handleAddToCart = (type: 'self' | 'donation') => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl || '📦',
      seller: product.category,
      quantity: quantity,
      type: type
    }));

    // Mevcut miktarı Redux'tan buluyoruz
    const existingItem = cartItems.find(item => item.id === product.id && item.type === type);
    const newTotalQuantity = (existingItem?.quantity || 0) + quantity;

    // Backend Senkronizasyonu (Veritabanında kalıcı olması için TOPLAM miktarı gönderiyoruz)
    dispatch(syncCartItem({
      id: product.id,
      quantity: newTotalQuantity,
      type: type
    }));
    
    Alert.alert(
      type === 'self' ? 'Sepete Eklendi' : 'Bağış Sepetine Eklendi',
      `${product.name} başarıyla eklendi.`,
      [
        { text: 'Alışverişe Devam Et', style: 'cancel' },
        { text: 'Sepete Git', onPress: () => navigation.navigate('Cart') }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image Area */}
        <View style={[styles.imageArea, { backgroundColor: theme.surface }]}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={{ fontSize: 24, color: theme.text1 }}>←</Text>
          </TouchableOpacity>
          {product.imageUrl?.startsWith('http') ? (
            <Image 
              source={{ uri: product.imageUrl }} 
              style={styles.productImage} 
              resizeMode="contain" 
            />
          ) : (
            <Text style={styles.productEmoji}>{product.imageUrl || '📦'}</Text>
          )}
          <View style={styles.imageActions}>
            <TouchableOpacity style={styles.iconBtn}><Text style={{fontSize: 20}}>❤️</Text></TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}><Text style={{fontSize: 20}}>🔗</Text></TouchableOpacity>
          </View>
        </View>

        <View style={[styles.content, { backgroundColor: theme.bg }]}>
          {/* Product Info */}
          <View style={styles.infoSection}>
            <Text style={[styles.productName, { color: theme.text1 }]}>{product.name}</Text>
            <View style={styles.ratingRow}>
              <Text style={{ color: '#F59E0B' }}>⭐⭐⭐⭐⭐</Text>
              <Text style={[styles.ratingText, { color: theme.text3 }]}>4.8 (124 yorum)</Text>
            </View>
            <Text style={[styles.productPrice, { color: theme.accent }]}>₺{product.price.toLocaleString('tr-TR')}</Text>
            <Text style={[styles.kargoInfo, { color: theme.text4 }]}>Kargo: ₺30 (İyilik Express)</Text>
          </View>

          {/* Action Row - Shopping Focused */}
          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={[styles.buyBtn, { backgroundColor: theme.accent }]}
              onPress={() => handleAddToCart('self')}
            >
              <Text style={styles.buyBtnText}>Sepete Ekle</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.giftBtn, { borderColor: theme.accent }]}
              onPress={() => handleAddToCart('donation')}
            >
              <Text style={[styles.giftBtnText, { color: theme.accent }]}>Hediye Et / Bağışla</Text>
            </TouchableOpacity>
          </View>

          {/* Social Proof / Trust */}
          <View style={styles.trustRow}>
            <Text style={{fontSize: 16}}>🚚</Text>
            <Text style={[styles.trustText, { color: theme.text3 }]}>Yarın Kapında (Ücretsiz Kargo)</Text>
          </View>

          {/* Tabs / Details */}
          <View style={styles.detailsSection}>
            <Text style={[styles.detailTitle, { color: theme.text1 }]}>📝 Ürün Açıklaması</Text>
            <Text style={[styles.detailText, { color: theme.text2 }]}>
              {product.description || 'Bu ürün hakkında henüz detaylı bir açıklama girilmemiştir.'}
            </Text>

            <Text style={[styles.detailTitle, { color: theme.text1, marginTop: 20 }]}>🔹 Teknik Özellikler</Text>
            <View style={styles.specRow}>
              <Text style={[styles.specKey, { color: theme.text3 }]}>Kategori</Text>
              <Text style={[styles.specValue, { color: theme.text1 }]}>{product.category}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={[styles.specKey, { color: theme.text3 }]}>Stok Durumu</Text>
              <Text style={[styles.specValue, { color: theme.text1 }]}>{product.stockQuantity > 0 ? 'Mevcut' : 'Tükendi'}</Text>
            </View>
          </View>

          {/* Subtle Impact Notice */}
          <View style={[styles.impactNotice, { backgroundColor: theme.bg }]}>
            <Text style={[styles.impactText, { color: '#10B981' }]}>
              ✨ Bu ürünü hediye ederek bir çocuğun okul masrafına destek olabilirsin.
            </Text>
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Bottom Floating Bar */}
      <View style={[styles.bottomBar, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        <View style={styles.quantityControl}>
          <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))} style={styles.qBtn}>
            <Text style={[styles.qBtnText, { color: theme.accent }]}>-</Text>
          </TouchableOpacity>
          <Text style={[styles.qValue, { color: theme.text1 }]}>{quantity}</Text>
          <TouchableOpacity onPress={() => setQuantity(quantity + 1)} style={styles.qBtn}>
            <Text style={[styles.qBtnText, { color: theme.accent }]}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={[styles.floatingBuyBtn, { backgroundColor: theme.accent }]}
          onPress={() => handleAddToCart('self')}
        >
          <Text style={styles.floatingBuyBtnText}>Sepete Ekle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageArea: { 
    height: width, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  backButton: { position: 'absolute', top: 50, left: 20, padding: 10 },
  imageActions: { position: 'absolute', top: 50, right: 20, gap: 10 },
  iconBtn: { padding: 10, backgroundColor: 'white', borderRadius: 12, elevation: 2 },
  productEmoji: { fontSize: 120 },
  productImage: { width: '80%', height: '80%' },
  content: { padding: 20, marginTop: -20 },
  infoSection: { marginBottom: 24 },
  productName: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  ratingText: { fontSize: 14 },
  productPrice: { fontSize: 32, fontWeight: 'bold', marginBottom: 4 },
  kargoInfo: { fontSize: 13 },
  actionRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  buyBtn: { flex: 1, height: 54, borderRadius: 16, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  buyBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  giftBtn: { flex: 1, height: 54, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 2 },
  giftBtnText: { fontSize: 13, fontWeight: 'bold' },
  trustRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 24, paddingHorizontal: 5 },
  trustText: { fontSize: 14, fontWeight: '500' },
  detailsSection: { marginBottom: 20 },
  detailTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  detailText: { fontSize: 15, lineHeight: 24 },
  specRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#00000005' },
  specKey: { fontSize: 14 },
  specValue: { fontSize: 14, fontWeight: '600' },
  impactNotice: { padding: 15, borderRadius: 15, marginTop: 10, alignItems: 'center', borderWidth: 1, borderColor: '#10B98130' },
  impactText: { fontSize: 13, fontWeight: '500', textAlign: 'center' },
  bottomBar: { 
    position: 'absolute', 
    bottom: 0, 
    width: '100%', 
    padding: 20, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 15,
    borderTopWidth: 1,
    paddingBottom: 35
  },
  quantityControl: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#00000005', 
    borderRadius: 15,
    padding: 5
  },
  qBtn: { paddingHorizontal: 15, paddingVertical: 10 },
  qBtnText: { fontSize: 24, fontWeight: 'bold' },
  qValue: { fontSize: 18, fontWeight: 'bold', minWidth: 30, textAlign: 'center' },
  floatingBuyBtn: { flex: 1, height: 54, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  floatingBuyBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});