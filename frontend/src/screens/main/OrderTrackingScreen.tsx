import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api/api';

export default function OrderTrackingScreen({ route, navigation }: any) {
  const { theme } = useTheme();
  const { orderId } = route.params || {};
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const data = await api.orders.getById(orderId);
      setOrder(data);
    } catch (error) {
      console.error('Fetch order detail error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'DELIVERED': return { label: 'Teslim Edildi', color: '#10B981', icon: '✅' };
      case 'SHIPPED': return { label: 'Kargoda', color: '#3B82F6', icon: '🚚' };
      case 'PROCESSING': return { label: 'Hazırlanıyor', color: '#F59E0B', icon: '⏳' };
      case 'CANCELLED': return { label: 'İptal Edildi', color: '#EF4444', icon: '❌' };
      default: return { label: 'Beklemede', color: '#6B7280', icon: '🕒' };
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.bg, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        <View style={[styles.header, { backgroundColor: theme.surface }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={{ fontSize: 24, color: theme.text1 }}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text1 }]}>Sipariş Detayı</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
          <Text style={{ fontSize: 50, marginBottom: 20 }}>🔍</Text>
          <Text style={[styles.statusLabel, { color: theme.text1, textAlign: 'center' }]}>Sipariş Bulunamadı</Text>
          <Text style={{ color: theme.text3, textAlign: 'center', marginTop: 10 }}>Bu sipariş bilgisine şu an ulaşılamıyor.</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('MainTabs')}
            style={[styles.backBtn, { backgroundColor: theme.accent, width: 'auto', paddingHorizontal: 20, height: 45, borderRadius: 12, marginTop: 20, alignItems: 'center' }]}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Alışverişe Başla</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const statusInfo = getStatusInfo(order.status);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ fontSize: 24, color: theme.text1 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text1 }]}>Sipariş Detayı</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Status Card */}
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <View style={[styles.statusHeader, { backgroundColor: statusInfo.color + '10' }]}>
            <Text style={{ fontSize: 32 }}>{statusInfo.icon}</Text>
            <View>
              <Text style={[styles.statusLabel, { color: statusInfo.color }]}>{statusInfo.label}</Text>
              <Text style={[styles.orderNo, { color: theme.text3 }]}>Sipariş No: #{order.id.substring(0, 8).toUpperCase()}</Text>
            </View>
          </View>
          
          <View style={styles.orderMeta}>
            <View style={styles.metaItem}>
              <Text style={[styles.metaLabel, { color: theme.text3 }]}>Tarih</Text>
              <Text style={[styles.metaValue, { color: theme.text1 }]}>{new Date(order.createdAt).toLocaleDateString('tr-TR')}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.metaItem}>
              <Text style={[styles.metaLabel, { color: theme.text3 }]}>Ödeme</Text>
              <Text style={[styles.metaValue, { color: theme.text1 }]}>{order.paymentMethod || 'Kredi Kartı'}</Text>
            </View>
          </View>
        </View>

        {/* Products */}
        <Text style={[styles.sectionTitle, { color: theme.text1 }]}>Ürünler</Text>
        <View style={[styles.card, { backgroundColor: theme.surface, padding: 0 }]}>
          {order.items.map((item: any, index: number) => (
            <View key={index}>
              <View style={styles.productItem}>
                <View style={[styles.productImageContainer, { backgroundColor: theme.bg }]}>
                  {item.productImage?.startsWith('http') ? (
                    <Image source={{ uri: item.productImage }} style={styles.productImage} />
                  ) : (
                    <Text style={{ fontSize: 30 }}>{item.productImage || '📦'}</Text>
                  )}
                </View>
                <View style={styles.productInfo}>
                  <Text style={[styles.productName, { color: theme.text1 }]} numberOfLines={2}>{item.productName}</Text>
                  <Text style={[styles.productQty, { color: theme.text3 }]}>{item.quantity} Adet</Text>
                </View>
                <Text style={[styles.productPrice, { color: theme.text1 }]}>
                  ₺{(item.unitPrice || item.price || 0).toLocaleString('tr-TR')}
                </Text>
              </View>
              {index < order.items.length - 1 && <View style={[styles.itemDivider, { backgroundColor: theme.border }]} />}
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: theme.text3 }]}>Ara Toplam</Text>
            <Text style={[styles.totalValue, { color: theme.text1 }]}>
              ₺{((order.totalAmount || 0) - (order.roundUpAmount || 0)).toLocaleString('tr-TR')}
            </Text>
          </View>
          {(order.roundUpAmount || 0) > 0 && (
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: theme.accent }]}>İyilik Cüzdanı (Bağış)</Text>
              <Text style={[styles.totalValue, { color: theme.accent }]}>+₺{order.roundUpAmount.toLocaleString('tr-TR')}</Text>
            </View>
          )}
          <View style={[styles.divider, { backgroundColor: theme.border, marginVertical: 12 }]} />
          <View style={styles.totalRow}>
            <Text style={[styles.grandTotalLabel, { color: theme.text1 }]}>Genel Toplam</Text>
            <Text style={[styles.grandTotalValue, { color: theme.accent }]}>
              ₺{(order.totalAmount || 0).toLocaleString('tr-TR')}
            </Text>
          </View>
        </View>

        {/* Address */}
        <Text style={[styles.sectionTitle, { color: theme.text1 }]}>Teslimat Adresi</Text>
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={[styles.addressText, { color: theme.text1, fontWeight: '500' }]}>
            {order.shippingAddress || 'Adres bilgisi bulunamadı.'}
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  scrollContent: { padding: 20 },
  card: { borderRadius: 20, padding: 16, marginBottom: 20, elevation: 2 },
  statusHeader: { flexDirection: 'row', alignItems: 'center', gap: 15, padding: 15, borderRadius: 15, marginBottom: 15 },
  statusLabel: { fontSize: 18, fontWeight: 'bold' },
  orderNo: { fontSize: 12, marginTop: 2 },
  orderMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 },
  metaItem: { flex: 1, alignItems: 'center' },
  metaLabel: { fontSize: 11, marginBottom: 4 },
  metaValue: { fontSize: 13, fontWeight: 'bold' },
  divider: { width: 1, height: 30, marginHorizontal: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, marginLeft: 5 },
  productItem: { flexDirection: 'row', padding: 15, alignItems: 'center' },
  productImageContainer: { width: 60, height: 60, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  productImage: { width: '100%', height: '100%', borderRadius: 12 },
  productInfo: { flex: 1, marginLeft: 15 },
  productName: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  productQty: { fontSize: 12 },
  productPrice: { fontSize: 15, fontWeight: 'bold' },
  itemDivider: { height: 1, marginHorizontal: 15 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  totalLabel: { fontSize: 14 },
  totalValue: { fontSize: 14, fontWeight: '600' },
  grandTotalLabel: { fontSize: 16, fontWeight: 'bold' },
  grandTotalValue: { fontSize: 20, fontWeight: 'bold' },
  addressTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 6 },
  addressText: { fontSize: 14, lineHeight: 20 }
});