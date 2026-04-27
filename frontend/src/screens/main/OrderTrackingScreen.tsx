import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const myOrders = [
  { id: 1, productName: 'iPhone 15', quantity: 1, price: 45000, date: '15.01.2024', status: 'delivered', trackingCode: 'TR123456' },
  { id: 2, productName: 'Kazak', quantity: 2, price: 450, date: '10.01.2024', status: 'shipping', trackingCode: 'TR789012' },
  { id: 3, productName: 'Powerbank', quantity: 1, price: 299, date: '05.01.2024', status: 'delivered', trackingCode: 'TR345678' },
];

export default function OrderTrackingScreen({ navigation }: any) {
  const { theme } = useTheme();

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return '✅ Teslim Edildi';
      case 'shipping': return '🚚 Kargoda';
      default: return '⏳ Hazırlanıyor';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 24 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text1 }]}>📦 Siparişlerim</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={myOrders}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.orderCard, { backgroundColor: theme.surface }]}>
            <View style={styles.orderHeader}>
              <Text style={[styles.orderName, { color: theme.text1 }]}>{item.productName} x{item.quantity}</Text>
              <Text style={[styles.orderStatus, { color: item.status === 'delivered' ? '#10B981' : '#F59E0B' }]}>
                {getStatusText(item.status)}
              </Text>
            </View>
            <Text style={[styles.orderPrice, { color: theme.accent }]}>₺{item.price * item.quantity}</Text>
            <Text style={[styles.orderDate, { color: theme.text4 }]}>📅 {item.date}</Text>
            <Text style={[styles.trackingCode, { color: theme.text3 }]}>Takip Kodu: {item.trackingCode}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  list: { padding: 16 },
  orderCard: { padding: 16, borderRadius: 16, marginBottom: 12 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  orderName: { fontSize: 16, fontWeight: '600' },
  orderStatus: { fontSize: 12, fontWeight: '600' },
  orderPrice: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  orderDate: { fontSize: 12, marginBottom: 8 },
  trackingCode: { fontSize: 11 },
});