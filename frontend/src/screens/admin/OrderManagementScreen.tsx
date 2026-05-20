import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput, Platform, Modal } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../services/api/api';

export default function OrderManagementScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('ALL');

  // Shipping Modal states
  const [shipModalVisible, setShipModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [shippingCompany, setShippingCompany] = useState('İyilik Express');
  const [trackingNumber, setTrackingNumber] = useState('');

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.orders.getAll();
      setOrders(res || []);
    } catch (error) {
      console.error('Fetch admin orders error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShipOrder = async () => {
    if (!selectedOrderId) return;
    try {
      setLoading(true);
      await api.orders.ship(selectedOrderId, shippingCompany, trackingNumber || undefined);
      setShipModalVisible(false);
      setSelectedOrderId(null);
      setTrackingNumber('');
      Alert.alert('Başarılı', 'Sipariş kargoya verildi (SHIPPED) durumuna güncellendi.');
      fetchOrders();
    } catch (error) {
      console.error('Ship order error:', error);
      Alert.alert('Hata', 'Sipariş durumunu güncellerken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeliverOrder = async (orderId: string) => {
    Alert.alert(
      'Siparişi Teslim Et',
      'Bu siparişi teslim edildi (DELIVERED) durumuna güncellemek istediğinizden emin misiniz?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Evet, Teslim Et',
          onPress: async () => {
            try {
              setLoading(true);
              await api.orders.deliver(orderId);
              Alert.alert('Başarılı', 'Sipariş teslim edildi (DELIVERED) durumuna güncellendi.');
              fetchOrders();
            } catch (error) {
              console.error('Deliver order error:', error);
              Alert.alert('Hata', 'Sipariş teslim edilemedi.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return '#10B981';
      case 'SHIPPED': return '#3B82F6';
      case 'PROCESSING': return '#F59E0B';
      case 'CANCELLED': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'Teslim Edildi';
      case 'SHIPPED': return 'Kargoda';
      case 'PROCESSING': return 'Hazırlanıyor';
      case 'CANCELLED': return 'İptal Edildi';
      default: return 'Beklemede';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'ALL') return true;
    return order.status === activeTab;
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ fontSize: 24, color: theme.text1 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text1 }]}>Sipariş Yönetimi</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={[styles.tabBar, { borderBottomColor: theme.border }]}>
        {['ALL', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tabItem,
              activeTab === tab && { borderBottomColor: theme.accent, borderBottomWidth: 2 }
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab ? theme.accent : theme.text3 }
              ]}
            >
              {tab === 'ALL' ? 'Tümü' : getStatusLabel(tab)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && orders.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {filteredOrders.length === 0 ? (
            <Text style={[styles.emptyText, { color: theme.text3 }]}>Bu durumda sipariş bulunmuyor.</Text>
          ) : (
            filteredOrders.map((order) => (
              <View key={order.id} style={[styles.orderCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={[styles.orderIdText, { color: theme.text1 }]}>Sipariş: #{order.id.substring(0, 8).toUpperCase()}</Text>
                    <Text style={{ color: theme.text3, fontSize: 11 }}>
                      {new Date(order.createdAt).toLocaleDateString('tr-TR')} {new Date(order.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '15' }]}>
                    <Text style={{ color: getStatusColor(order.status), fontWeight: 'bold', fontSize: 11 }}>
                      {getStatusLabel(order.status)}
                    </Text>
                  </View>
                </View>

                <View style={[styles.divider, { backgroundColor: theme.border }]} />

                <View style={styles.cardBody}>
                  <Text style={[styles.infoText, { color: theme.text2 }]}><Text style={styles.boldText}>Alıcı:</Text> {order.buyerName}</Text>
                  <Text style={[styles.infoText, { color: theme.text2 }]}><Text style={styles.boldText}>Adres:</Text> {order.shippingAddress}</Text>
                  <Text style={[styles.infoText, { color: theme.text2 }]}><Text style={styles.boldText}>Tutar:</Text> ₺{order.totalAmount.toLocaleString('tr-TR')}</Text>
                  
                  {order.shippingCompany && (
                    <Text style={[styles.infoText, { color: theme.text2 }]}>
                      <Text style={styles.boldText}>Kargo Şirketi:</Text> {order.shippingCompany}
                    </Text>
                  )}
                  {order.trackingNumber && (
                    <Text style={[styles.infoText, { color: theme.text2 }]}>
                      <Text style={styles.boldText}>Kargo Takip No:</Text> {order.trackingNumber}
                    </Text>
                  )}

                  {/* Order items summary */}
                  <View style={[styles.itemsSummaryContainer, { backgroundColor: theme.bg }]}>
                    {order.items?.map((item: any, idx: number) => (
                      <Text key={idx} style={{ fontSize: 12, color: theme.text2, marginVertical: 2 }}>
                        • {item.productName} ({item.quantity} Adet)
                      </Text>
                    ))}
                  </View>
                </View>

                {/* Admin Actions */}
                <View style={styles.cardActions}>
                  {order.status === 'PROCESSING' && (
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: theme.accent }]}
                      onPress={() => {
                        setSelectedOrderId(order.id);
                        setTrackingNumber('TRK' + Math.floor(Math.random() * 100000000));
                        setShipModalVisible(true);
                      }}
                    >
                      <Text style={styles.actionBtnText}>🚚 Kargola</Text>
                    </TouchableOpacity>
                  )}
                  {order.status === 'SHIPPED' && (
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: '#10B981' }]}
                      onPress={() => handleDeliverOrder(order.id)}
                    >
                      <Text style={styles.actionBtnText}>✅ Teslim Et</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* Shipping Input Modal */}
      <Modal visible={shipModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.text1 }]}>Kargo Bilgilerini Girin</Text>
            
            <Text style={[styles.inputLabel, { color: theme.text2 }]}>Kargo Firması</Text>
            <TextInput
              value={shippingCompany}
              onChangeText={setShippingCompany}
              style={[styles.input, { color: theme.text1, borderColor: theme.border }]}
              placeholder="Firması..."
              placeholderTextColor={theme.text3}
            />

            <Text style={[styles.inputLabel, { color: theme.text2 }]}>Kargo Takip No</Text>
            <TextInput
              value={trackingNumber}
              onChangeText={setTrackingNumber}
              style={[styles.input, { color: theme.text1, borderColor: theme.border }]}
              placeholder="Takip numarası girin..."
              placeholderTextColor={theme.text3}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: theme.bg, borderColor: theme.border, borderWidth: 1 }]}
                onPress={() => setShipModalVisible(false)}
              >
                <Text style={{ color: theme.text2 }}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: theme.accent }]}
                onPress={handleShipOrder}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Gönder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingTop: Platform.OS === 'android' ? 45 : 20,
    paddingBottom: 20,
    elevation: 2
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  tabBar: { flexDirection: 'row', justifyContent: 'space-around', borderBottomWidth: 1 },
  tabItem: { paddingVertical: 12, paddingHorizontal: 6 },
  tabText: { fontSize: 11, fontWeight: 'bold' },
  scrollContent: { padding: 20 },
  emptyText: { textAlign: 'center', marginVertical: 40, fontSize: 14 },
  orderCard: { borderRadius: 20, padding: 16, marginBottom: 20, borderWidth: 1, elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderIdText: { fontSize: 14, fontWeight: 'bold' },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8 },
  divider: { height: 1, marginVertical: 12 },
  cardBody: { gap: 6 },
  infoText: { fontSize: 13 },
  boldText: { fontWeight: 'bold' },
  itemsSummaryContainer: { padding: 10, borderRadius: 10, marginTop: 10 },
  cardActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15 },
  actionBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12, minWidth: 100, alignItems: 'center' },
  actionBtnText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', borderRadius: 24, padding: 24 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  inputLabel: { fontSize: 13, fontWeight: '500', marginBottom: 6 },
  input: { height: 45, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, marginBottom: 15 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  modalBtn: { flex: 0.48, height: 45, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }
});
