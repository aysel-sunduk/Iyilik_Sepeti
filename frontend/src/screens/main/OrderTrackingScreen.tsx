import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Image, Alert, Platform } from 'react-native';
import Svg, { Circle, Path, G, Rect } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api/api';

const ROUTE_POINTS = [
  { x: 30, y: 130, label: 'Depo', description: 'İyilik Sepeti Deposu' },
  { x: 90, y: 70, label: 'Ana Dağıtım', description: 'Bölge Aktarma Merkezi' },
  { x: 160, y: 120, label: 'Dağıtım Şubesi', description: 'İyilik Şubesi' },
  { x: 220, y: 60, label: 'Sokağınızda', description: 'Son Kurye Dağıtımı' },
  { x: 270, y: 110, label: 'Ev', description: 'Teslimat Adresi' }
];

export default function OrderTrackingScreen({ route, navigation }: any) {
  const { theme } = useTheme();
  const { orderId } = route.params || {};
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0.1); // 10% initial progress

  useEffect(() => {
    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId]);

  useEffect(() => {
    let interval: any;
    if (order && order.status === 'SHIPPED') {
      // Calculate initial progress based on when the order was shipped
      const startSecs = order.shippedAt ? new Date(order.shippedAt).getTime() : new Date(order.createdAt).getTime();
      const currentSecs = new Date().getTime();
      const elapsedMinutes = (currentSecs - startSecs) / 60000;
      
      // Let's assume a full simulated delivery takes 10 minutes (600,000ms)
      // If we are testing or just shipped, let's start at a minimum of 10%
      const initialProgress = Math.min(0.99, Math.max(0.1, elapsedMinutes * 0.1));
      setProgress(initialProgress);

      // Increment progress by 1% (0.01) every 2 seconds for a lively real-time effect
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 1.0) {
            clearInterval(interval);
            return 1.0;
          }
          return prev + 0.01;
        });
      }, 2000);
    } else if (order && order.status === 'DELIVERED') {
      setProgress(1.0);
    }
    return () => clearInterval(interval);
  }, [order]);

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

  const getCourierPosition = (p: number) => {
    if (p <= 0) return ROUTE_POINTS[0];
    if (p >= 1) return ROUTE_POINTS[ROUTE_POINTS.length - 1];

    const totalSegments = ROUTE_POINTS.length - 1;
    const rawSegment = p * totalSegments;
    const segmentIndex = Math.floor(rawSegment);
    const segmentProgress = rawSegment - segmentIndex;

    const start = ROUTE_POINTS[segmentIndex];
    const end = ROUTE_POINTS[segmentIndex + 1];

    const x = start.x + (end.x - start.x) * segmentProgress;
    const y = start.y + (end.y - start.y) * segmentProgress;

    return { x, y };
  };

  const getCourierStatusText = (p: number) => {
    if (p >= 1.0) return 'Siparişiniz Kapınızda / Teslim Edildi!';
    if (p >= 0.8) return 'Kuryemiz sokağınıza giriş yaptı, kapınızı çalmak üzere!';
    if (p >= 0.5) return 'Kuryemiz son teslimat şubesinden çıktı, adresinize yaklaşıyor.';
    if (p >= 0.2) return 'Siparişiniz ana dağıtım transfer merkezinde ayrıştırıldı.';
    return 'Siparişiniz merkez depomuzdan yola çıktı.';
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
            onPress={() => navigation.navigate('Ana Sayfa')}
            style={[styles.backBtn, { backgroundColor: theme.accent, width: 'auto', paddingHorizontal: 20, height: 45, borderRadius: 12, marginTop: 20, alignItems: 'center' }]}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Alışverişe Başla</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const courierPos = getCourierPosition(progress);

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

        {/* Live Route Tracking Card (Appears if status is SHIPPED or DELIVERED) */}
        {(order.status === 'SHIPPED' || order.status === 'DELIVERED') && (
          <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <Text style={[styles.trackingCardTitle, { color: theme.text1 }]}>📍 Canlı Kargo Takibi</Text>
            
            {/* The SVG Route Map */}
            <View style={[styles.svgMapWrapper, { backgroundColor: theme.bg }]}>
              <Svg viewBox="0 0 300 180" width="100%" height={160}>
                {/* Draw Route Path connecting coordinates */}
                <Path
                  d="M 30 130 C 60 70, 80 70, 90 70 C 100 70, 140 120, 160 120 C 180 120, 200 60, 220 60 C 240 60, 250 110, 270 110"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth={4}
                  strokeLinecap="round"
                />
                
                {/* Draw active portion of path in Accent Color */}
                <Path
                  d="M 30 130 C 60 70, 80 70, 90 70 C 100 70, 140 120, 160 120 C 180 120, 200 60, 220 60 C 240 60, 250 110, 270 110"
                  fill="none"
                  stroke={theme.accent}
                  strokeWidth={4}
                  strokeLinecap="round"
                  strokeDasharray="300"
                  strokeDashoffset={300 - (300 * progress)}
                />

                {/* Route Markers (Points) */}
                {ROUTE_POINTS.map((pt, idx) => {
                  const isCurrent = progress * (ROUTE_POINTS.length - 1) >= idx;
                  return (
                    <G key={idx}>
                      <Circle
                        cx={pt.x}
                        cy={pt.y}
                        r={6}
                        fill={isCurrent ? theme.accent : '#D1D5DB'}
                      />
                      <Circle
                        cx={pt.x}
                        cy={pt.y}
                        r={3}
                        fill="white"
                      />
                    </G>
                  );
                })}

                {/* Moving Courier Icon */}
                <G transform={`translate(${courierPos.x - 12}, ${courierPos.y - 12})`}>
                  {/* Glowing background ring */}
                  <Circle cx={12} cy={12} r={14} fill={theme.accent} opacity={0.2} />
                  <Circle cx={12} cy={12} r={10} fill={theme.accent} />
                  {/* Delivery truck/motorcycle icon representation */}
                  <Rect x={7} y={8} width={10} height={8} rx={1} fill="white" />
                  <Circle cx={9} cy={16} r={2} fill="white" />
                  <Circle cx={15} cy={16} r={2} fill="white" />
                </G>
              </Svg>
            </View>

            {/* Tracking Status Display */}
            <View style={styles.trackingInfo}>
              <View style={styles.progressRow}>
                <Text style={[styles.progressPct, { color: theme.accent }]}>Yolculuk: %{Math.round(progress * 100)}</Text>
                <Text style={[styles.progressTime, { color: theme.text3 }]}>
                  Tahmini Teslimat: {progress >= 1.0 ? 'Teslim Edildi' : `${Math.max(1, Math.round((1 - progress) * 15))} dk`}
                </Text>
              </View>
              <Text style={[styles.trackingStatusText, { color: theme.text1 }]}>
                {getCourierStatusText(progress)}
              </Text>
              
              <View style={[styles.divider, { backgroundColor: theme.border, marginVertical: 12 }]} />
              
              {/* Courier Interaction Mock Buttons */}
              <View style={styles.courierContactRow}>
                <View style={styles.courierMeta}>
                  <Text style={{ fontSize: 24 }}>🛵</Text>
                  <View style={{ marginLeft: 10 }}>
                    <Text style={[styles.courierName, { color: theme.text1 }]}>Ali Yılmaz</Text>
                    <Text style={{ color: theme.text3, fontSize: 11 }}>İyilik Express Kuryesi</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.callBtn, { borderColor: theme.accent, borderWidth: 1 }]}
                  onPress={() => Alert.alert('Kuryeyi Ara', 'Kurye Ali Yılmaz aranıyor: +90 555 123 45 67')}
                >
                  <Text style={[styles.callBtnText, { color: theme.accent }]}>📞 Ara</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 45 : 20, paddingBottom: 20 },
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
  addressText: { fontSize: 14, lineHeight: 20 },
  
  // Tracking styles
  trackingCardTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 15 },
  svgMapWrapper: { borderRadius: 16, overflow: 'hidden', padding: 10, alignItems: 'center' },
  trackingInfo: { marginTop: 15 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressPct: { fontSize: 13, fontWeight: 'bold' },
  progressTime: { fontSize: 12, fontWeight: '500' },
  trackingStatusText: { fontSize: 13, lineHeight: 18, fontWeight: '500' },
  courierContactRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  courierMeta: { flexDirection: 'row', alignItems: 'center' },
  courierName: { fontSize: 13, fontWeight: 'bold' },
  callBtn: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 10 },
  callBtnText: { fontSize: 12, fontWeight: 'bold' }
});