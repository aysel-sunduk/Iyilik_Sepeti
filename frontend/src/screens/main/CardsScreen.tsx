import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api/api';
import { useFocusEffect } from '@react-navigation/native';

export default function CardsScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchCards();
    }, [])
  );

  const fetchCards = async () => {
    try {
      if (!refreshing) setLoading(true);
      const data = await api.user.getCards();
      setCards(data);
    } catch (error) {
      console.error('Fetch cards error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCards();
  };

  const handleDeleteCard = (id: string) => {
    Alert.alert('Kartı Sil', 'Bu kartı silmek istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: async () => {
          try {
            await api.user.deleteCard(id);
            fetchCards();
          } catch (e) {
            Alert.alert('Hata', 'Kart silinemedi.');
          }
      }}
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ fontSize: 24, color: theme.text1 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text1 }]}>Kayıtlı Kartlarım</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddCard')}>
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
          {cards.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={{ fontSize: 60, marginBottom: 20 }}>💳</Text>
              <Text style={[styles.emptyText, { color: theme.text2 }]}>Henüz bir kart eklemediniz.</Text>
            </View>
          ) : (
            cards.map((item) => (
              <View key={item.id} style={[styles.cardWrapper, { backgroundColor: '#1F2937' }]}>
                 <View style={styles.cardHeader}>
                    <Text style={styles.alias}>{item.cardAlias}</Text>
                    <TouchableOpacity onPress={() => handleDeleteCard(item.id)}>
                      <Text style={{ color: '#F87171', fontWeight: 'bold' }}>SİL</Text>
                    </TouchableOpacity>
                 </View>
                 
                 <Text style={styles.number}>**** **** **** {item.cardNumberLastFour}</Text>
                 
                 <View style={styles.cardFooter}>
                    <View>
                      <Text style={styles.label}>KART SAHİBİ</Text>
                      <Text style={styles.holder}>{item.cardHolderName}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.label}>S.K.T</Text>
                      <Text style={styles.expiry}>{item.expiryMonth}/{item.expiryYear}</Text>
                    </View>
                 </View>
              </View>
            ))
          )}

          <TouchableOpacity 
            style={[styles.addBtn, { backgroundColor: theme.surface, borderColor: theme.accent }]}
            onPress={() => navigation.navigate('AddCard')}
          >
            <View style={[styles.plusCircle, { backgroundColor: theme.accent }]}>
               <Text style={styles.plusText}>+</Text>
            </View>
            <Text style={[styles.addBtnText, { color: theme.text1 }]}>Yeni Kart Ekle</Text>
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
    elevation: 4
  },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 16, fontWeight: '500' },
  cardWrapper: { 
    borderRadius: 20, 
    padding: 25, 
    marginBottom: 20, 
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  alias: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  number: { color: 'white', fontSize: 22, letterSpacing: 3, marginBottom: 30, textAlign: 'center' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  label: { color: '#9CA3AF', fontSize: 10, fontWeight: 'bold', marginBottom: 4 },
  holder: { color: 'white', fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase' },
  expiry: { color: 'white', fontSize: 14, fontWeight: 'bold' },
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
