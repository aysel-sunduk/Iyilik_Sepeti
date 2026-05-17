import React, { useEffect, useState } from 'react';
import { 
  Alert, 
  FlatList, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api/api';

export default function DonationVerifyScreen() {
  const { theme } = useTheme();
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Form states (using a record to handle multiple items in a list)
  const [proofUrls, setProofUrls] = useState<Record<string, string>>({});
  const [beneficiaries, setBeneficiaries] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const data = await api.donations.getAll();
      // Sadece henüz teslim edilmemiş (PENDING veya SHIPPING olan) bağışları göster
      setDonations(data.filter((d: any) => d.status !== 'DELIVERED' && d.status !== 'COMPLETED' && d.status !== 'CANCELLED'));
    } catch (error) {
      console.error('Bağışlar yüklenemedi:', error);
      Alert.alert('Hata', 'Bağış listesi alınamadı.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleShip = async (donationId: string) => {
    try {
      setSubmitting(prev => ({ ...prev, [donationId]: true }));
      await api.donations.updateStatus(donationId, 'SHIPPING');
      Alert.alert('Başarılı', 'Bağış yola çıktı olarak işaretlendi.');
      fetchDonations(); // Listeyi yenile
    } catch (error) {
      console.error('Durum güncelleme hatası:', error);
      Alert.alert('Hata', 'Bağış durumu güncellenemedi.');
    } finally {
      setSubmitting(prev => ({ ...prev, [donationId]: false }));
    }
  };

  const handleVerify = async (donationId: string) => {
    const proofImageUrl = proofUrls[donationId];
    const beneficiary = beneficiaries[donationId];

    if (!proofImageUrl || !beneficiary) {
      Alert.alert('Uyarı', 'Lütfen kanıt fotoğraf URL\'si ve ihtiyaç sahibi ismini giriniz.');
      return;
    }

    try {
      setSubmitting(prev => ({ ...prev, [donationId]: true }));
      await api.donations.updateProof(donationId, { proofImageUrl, beneficiary });
      
      Alert.alert('Başarılı', 'Bağış teslim edildi olarak işaretlendi.');
      
      // Listeyi güncelle
      setDonations(prev => prev.filter(d => d.id !== donationId));
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      Alert.alert('Hata', 'Bağış güncellenirken bir sorun oluştu.');
    } finally {
      setSubmitting(prev => ({ ...prev, [donationId]: false }));
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: theme.bg }}
    >
      <View style={[styles.header, { backgroundColor: theme.accent }]}>
        <Text style={styles.headerTitle}>Saha Ekibi Paneli</Text>
        <Text style={styles.headerSub}>Teslimat Kanıtlarını Sisteme Yükle</Text>
      </View>

      <FlatList
        data={donations}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          fetchDonations();
        }}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 40 }}>🎉</Text>
            <Text style={[styles.emptyText, { color: theme.text3 }]}>Bekleyen bağış teslimatı bulunmuyor.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <View style={styles.cardInfo}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <Text style={[styles.productName, { color: theme.text1, flex: 1 }]}>{item.productName}</Text>
                <View style={[
                  styles.statusBadge, 
                  { backgroundColor: item.status === 'SHIPPING' ? '#F59E0B20' : '#10B98120' }
                ]}>
                  <Text style={[
                    styles.statusText, 
                    { color: item.status === 'SHIPPING' ? '#F59E0B' : '#10B981' }
                  ]}>
                    {item.status === 'SHIPPING' ? '🚚 Yolda' : '⏳ Beklemede'}
                  </Text>
                </View>
              </View>
              <Text style={[styles.donorText, { color: theme.text3 }]}>Bağışçı: {item.donorName}</Text>
              <Text style={[styles.quantityText, { color: theme.text3 }]}>Adet: {item.quantity}</Text>
              {item.notes && (
                <View style={[styles.noteBox, { backgroundColor: theme.bg }]}>
                  <Text style={[styles.noteText, { color: theme.text4 }]}>Not: {item.notes}</Text>
                </View>
              )}
            </View>

            {item.status !== 'SHIPPING' ? (
              <View style={styles.form}>
                <TouchableOpacity
                  style={[
                    styles.shipButton, 
                    { backgroundColor: '#F59E0B' },
                    submitting[item.id] && { opacity: 0.7 }
                  ]}
                  onPress={() => handleShip(item.id)}
                  disabled={submitting[item.id]}
                >
                  {submitting[item.id] ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.verifyButtonText}>🚚 Yola Çıkar</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.form}>
                <TextInput
                  placeholder="Kanıt Fotoğraf URL (örn: https://...)"
                  placeholderTextColor={theme.text4}
                  style={[styles.input, { borderColor: theme.border, color: theme.text1 }]}
                  value={proofUrls[item.id] || ''}
                  onChangeText={(text) => setProofUrls(prev => ({ ...prev, [item.id]: text }))}
                />
                <TextInput
                  placeholder="İhtiyaç Sahibi İsmi (örn: Ahmet Y.)"
                  placeholderTextColor={theme.text4}
                  style={[styles.input, { borderColor: theme.border, color: theme.text1 }]}
                  value={beneficiaries[item.id] || ''}
                  onChangeText={(text) => setBeneficiaries(prev => ({ ...prev, [item.id]: text }))}
                />

                <TouchableOpacity
                  style={[
                    styles.verifyButton, 
                    { backgroundColor: theme.accent },
                    submitting[item.id] && { opacity: 0.7 }
                  ]}
                  onPress={() => handleVerify(item.id)}
                  disabled={submitting[item.id]}
                >
                  {submitting[item.id] ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.verifyButtonText}>✅ Teslimatı Onayla</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  list: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardInfo: {
    marginBottom: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  donorText: {
    fontSize: 14,
    marginBottom: 2,
  },
  quantityText: {
    fontSize: 14,
  },
  noteBox: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#D1D5DB',
  },
  noteText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  form: {
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
  },
  verifyButton: {
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  shipButton: {
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
});