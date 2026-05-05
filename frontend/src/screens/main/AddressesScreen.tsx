import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api/api';
import { useFocusEffect } from '@react-navigation/native';

export default function AddressesScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchAddresses();
    }, [])
  );

  const fetchAddresses = async () => {
    try {
      if (!refreshing) setLoading(true);
      const data = await api.user.getAddresses();
      setAddresses(data);
    } catch (error) {
      console.error('Fetch addresses error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAddresses();
  };

  const handleSetDefault = async (id: string) => {
    try {
      await api.user.setDefaultAddress(id);
      fetchAddresses();
    } catch (error) {
      Alert.alert('Hata', 'Varsayılan adres güncellenemedi.');
    }
  };

  const handleDelete = (id: string, isDefault: boolean) => {
    if (isDefault) {
      Alert.alert('Hata', 'Varsayılan adresi silemezsiniz. Lütfen önce başka bir adresi varsayılan yapın.');
      return;
    }

    Alert.alert('Adresi Sil', 'Bu adresi silmek istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: async () => {
          try {
            await api.user.deleteAddress(id);
            fetchAddresses();
          } catch (e: any) {
            const errorMsg = e.response?.data?.message || 'Adres silinemedi.';
            Alert.alert('Hata', errorMsg);
          }
      }}
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ fontSize: 24, color: theme.text1 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text1 }]}>Adres Bilgilerim</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddAddress')}>
          <Text style={{ fontSize: 32, color: theme.accent }}>+</Text>
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.accent} />
          }
        >
          {addresses.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={{ fontSize: 60, marginBottom: 20 }}>📍</Text>
              <Text style={[styles.emptyText, { color: theme.text2 }]}>Henüz bir adres eklemediniz.</Text>
            </View>
          ) : (
            addresses.map((item) => (
              <View key={item.id} style={[styles.addressCard, { backgroundColor: theme.surface }]}>
                <View style={styles.cardHeader}>
                  <View style={styles.titleRow}>
                    <Text style={styles.icon}>🏠</Text>
                    <Text style={[styles.cardTitle, { color: theme.text1 }]}>{item.title}</Text>
                  </View>
                  {item.isDefault ? (
                    <View style={[styles.defaultBadge, { backgroundColor: theme.accent + '15' }]}>
                      <Text style={[styles.defaultText, { color: theme.accent }]}>Varsayılan</Text>
                    </View>
                  ) : (
                    <TouchableOpacity 
                      style={[styles.setDefaultBtn, { borderColor: theme.border }]}
                      onPress={() => handleSetDefault(item.id)}
                    >
                      <Text style={[styles.setDefaultText, { color: theme.text3 }]}>Varsayılan Yap</Text>
                    </TouchableOpacity>
                  )}
                </View>
                
                <Text style={[styles.fullName, { color: theme.text1 }]}>{item.fullName || 'Alıcı Belirtilmedi'}</Text>
                <Text style={[styles.addressLine, { color: theme.text2 }]}>{item.addressLine}</Text>
                <Text style={[styles.location, { color: theme.text3 }]}>
                  {item.district} / {item.city}
                </Text>
                
                <View style={styles.cardActions}>
                  <TouchableOpacity 
                    style={styles.actionBtn}
                    onPress={() => navigation.navigate('AddAddress', { address: item })}
                  >
                    <Text style={[styles.actionText, { color: theme.text2 }]}>Düzenle</Text>
                  </TouchableOpacity>
                  <View style={styles.divider} />
                  <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item.id, item.isDefault)}>
                    <Text style={[styles.actionText, { color: theme.error }]}>Sil</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          <TouchableOpacity 
            style={[styles.addBtn, { backgroundColor: theme.surface, borderColor: theme.accent }]}
            onPress={() => navigation.navigate('AddAddress')}
          >
            <View style={[styles.plusCircle, { backgroundColor: theme.accent }]}>
               <Text style={styles.plusText}>+</Text>
            </View>
            <Text style={[styles.addBtnText, { color: theme.text1 }]}>Yeni Adres Ekle</Text>
          </TouchableOpacity>
        </ScrollView>
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
    paddingTop: 60, 
    paddingBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 16, fontWeight: '500' },
  addressCard: { 
    borderRadius: 20, 
    padding: 20, 
    marginBottom: 16, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  icon: { fontSize: 18 },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  defaultBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  defaultText: { fontSize: 11, fontWeight: 'bold' },
  setDefaultBtn: { borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  setDefaultText: { fontSize: 11 },
  fullName: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  addressLine: { fontSize: 14, lineHeight: 20, marginBottom: 4 },
  location: { fontSize: 13, marginBottom: 15 },
  cardActions: { 
    flexDirection: 'row', 
    borderTopWidth: 1, 
    borderTopColor: '#00000005', 
    paddingTop: 15,
    marginTop: 5
  },
  actionBtn: { flex: 1, alignItems: 'center', paddingVertical: 5 },
  actionText: { fontSize: 14, fontWeight: '600' },
  divider: { width: 1, backgroundColor: '#00000010' },
  addBtn: { 
    height: 80, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderStyle: 'dashed',
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20,
    gap: 15,
    marginTop: 10
  },
  plusCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  plusText: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  addBtnText: { fontSize: 16, fontWeight: 'bold' }
});
