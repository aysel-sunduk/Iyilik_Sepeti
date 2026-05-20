import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api/api';

export default function OrdersScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await api.orders.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error('Fetch orders error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return '#10B981';
      case 'SHIPPED': return '#3B82F6';
      case 'PROCESSING': return '#F59E0B'; // Hazırlanıyor - Turuncu
      case 'CANCELLED': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const renderOrderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.orderCard, { backgroundColor: theme.surface, shadowColor: theme.text1 }]}
      onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
      activeOpacity={0.7}
    >
      <View style={styles.orderHeader}>
        <View style={styles.dateBadge}>
          <Text style={[styles.orderDate, { color: theme.text1 }]}>{new Date(item.createdAt).toLocaleDateString('tr-TR')}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.statusDescription}</Text>
        </View>
      </View>

      <View style={styles.orderBody}>
        <View style={styles.productStack}>
          {item.items.slice(0, 3).map((prod: any, idx: number) => (
            <View key={idx} style={[styles.imageWrapper, { borderColor: theme.surface }]}>
              <Image 
                source={{ uri: prod.productImage || 'https://via.placeholder.com/150' }} 
                style={styles.productThumb} 
              />
            </View>
          ))}
          {item.items.length > 3 && (
            <View style={[styles.moreBadge, { backgroundColor: theme.bg, borderColor: theme.surface }]}>
              <Text style={{ color: theme.text3, fontSize: 10, fontWeight: 'bold' }}>+{item.items.length - 3}</Text>
            </View>
          )}
        </View>

        <View style={styles.orderInfo}>
          <Text style={[styles.orderNo, { color: theme.text3 }]}>#{item.id.substring(0, 8).toUpperCase()}</Text>
          <View style={styles.priceRow}>
            <Text style={[styles.totalLabel, { color: theme.text3 }]}>Toplam:</Text>
            <Text style={[styles.totalValue, { color: theme.accent }]}>
            ₺{(item.totalAmount || 0).toLocaleString('tr-TR')}
          </Text>
          </View>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.text3 + '10' }]} />
      
      <View style={styles.orderFooter}>
        <Text style={[styles.viewDetail, { color: theme.text2 }]}>Sipariş Detayı</Text>
        <View style={[styles.arrowCircle, { backgroundColor: theme.accent + '15' }]}>
          <Text style={{ color: theme.accent, fontWeight: 'bold' }}>→</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, { backgroundColor: theme.bg }]}
        >
          <Text style={{ fontSize: 20, color: theme.text1 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text1 }]}>📦 Siparişlerim</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      ) : orders.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.center}>
          <View style={[styles.emptyIconContainer, { backgroundColor: theme.surface }]}>
            <Text style={{ fontSize: 50 }}>📦</Text>
          </View>
          <Text style={[styles.emptyTitle, { color: theme.text1 }]}>Henüz Sipariş Yok</Text>
          <Text style={[styles.emptyText, { color: theme.text3 }]}>Sepetini iyilikle doldurmaya ne dersin?</Text>
          <TouchableOpacity 
            style={[styles.shopBtn, { backgroundColor: theme.accent }]}
            onPress={() => navigation.navigate('Ana Sayfa')}
          >
            <Text style={styles.shopBtnText}>Alışverişe Başla</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 50, 
    paddingBottom: 25,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 15,
    zIndex: 10
  },
  backBtn: { width: 45, height: 45, borderRadius: 15, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  headerTitle: { fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  listContent: { padding: 20, paddingBottom: 120 },
  orderCard: { 
    borderRadius: 28, 
    padding: 20, 
    marginBottom: 20, 
    elevation: 6, 
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    borderWidth: 1,
    borderColor: '#00000005'
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  dateBadge: { backgroundColor: '#00000008', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  orderDate: { fontSize: 13, fontWeight: '700', opacity: 0.7 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  statusText: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  orderBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productStack: { flexDirection: 'row', alignItems: 'center', paddingLeft: 10 },
  imageWrapper: { 
    width: 60, 
    height: 60, 
    borderRadius: 18, 
    borderWidth: 4, 
    marginLeft: -15, 
    elevation: 4,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5
  },
  productThumb: { width: '100%', height: '100%', borderRadius: 14 },
  moreBadge: { width: 40, height: 40, borderRadius: 20, borderWidth: 3, marginLeft: -12, justifyContent: 'center', alignItems: 'center', elevation: 5, zIndex: 5 },
  orderInfo: { alignItems: 'flex-end' },
  orderNo: { fontSize: 12, fontWeight: '700', marginBottom: 6, opacity: 0.5 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline' },
  totalLabel: { fontSize: 13, marginRight: 6, fontWeight: '600' },
  totalValue: { fontSize: 24, fontWeight: '900', letterSpacing: -1 },
  divider: { height: 1.5, marginVertical: 20, opacity: 0.5 },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  viewDetail: { fontSize: 15, fontWeight: '800' },
  arrowCircle: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  emptyIconContainer: { width: 140, height: 140, borderRadius: 70, justifyContent: 'center', alignItems: 'center', marginBottom: 24, elevation: 10, shadowColor: '#000', shadowOpacity: 0.1 },
  emptyTitle: { fontSize: 24, fontWeight: '900', marginBottom: 10 },
  emptyText: { fontSize: 16, textAlign: 'center', marginBottom: 35, paddingHorizontal: 30, lineHeight: 24 },
  shopBtn: { paddingHorizontal: 45, paddingVertical: 20, borderRadius: 22, elevation: 12, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15 },
  shopBtnText: { color: 'white', fontWeight: '900', fontSize: 18, letterSpacing: 0.5 }
});
