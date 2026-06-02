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
  Platform,
  Modal
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api/api';

export default function DonationVerifyScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Form states (using a record to handle multiple items in a list)
  const [proofUrls, setProofUrls] = useState<Record<string, string>>({});
  const [beneficiaries, setBeneficiaries] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});
  
  // Map Modal State
  const [mapVisible, setMapVisible] = useState(false);

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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={{ fontSize: 24, color: '#fff' }}>←</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Saha Ekibi Paneli</Text>
            <Text style={styles.headerSub}>Teslimat Kanıtlarını Sisteme Yükle</Text>
          </View>
          <TouchableOpacity 
            style={[styles.mapButton, { backgroundColor: 'white' }]}
            onPress={() => setMapVisible(true)}
          >
            <Text style={{ fontSize: 18 }}>🗺️</Text>
            <Text style={{ color: theme.accent, fontWeight: 'bold', marginLeft: 6, fontSize: 13 }}>Haritada Gör</Text>
          </TouchableOpacity>
        </View>
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
              
              {item.addressText && (
                <View style={[styles.addressBox, { backgroundColor: theme.bg }]}>
                  <Text style={{ fontSize: 16, marginBottom: 2 }}>📍</Text>
                  <Text style={[styles.addressText, { color: theme.text1 }]}>{item.addressText}</Text>
                </View>
              )}
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

      <Modal visible={mapVisible} animationType="slide" onRequestClose={() => setMapVisible(false)}>
        <View style={{ flex: 1, backgroundColor: theme.bg }}>
          <View style={[styles.modalHeader, { backgroundColor: theme.surface }]}>
            <TouchableOpacity onPress={() => setMapVisible(false)} style={styles.backBtn}>
              <Text style={{ fontSize: 24, color: theme.text1 }}>✕</Text>
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.text1, fontSize: 18 }]}>Teslimat Haritası</Text>
            <View style={{ width: 40 }} />
          </View>
          <WebView
            originWhitelist={['*']}
            source={{ html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossorigin=""/>
                <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" crossorigin=""></script>
                <style>body { padding: 0; margin: 0; } html, body, #map { height: 100%; width: 100%; }</style>
              </head>
              <body>
                <div id="map"></div>
                <script>
                  var map = L.map('map').setView([41.0082, 28.9784], 11);
                  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
                  var bounds = [];
                  ${donations.filter(d => d.latitude && d.longitude).map(d => `
                    var marker = L.marker([${d.latitude}, ${d.longitude}]).addTo(map);
                    marker.bindPopup("<b>${d.productName}</b><br/>${d.addressText || ''}");
                    bounds.push([${d.latitude}, ${d.longitude}]);
                  `).join('\n')}
                  if(bounds.length > 0) { map.fitBounds(bounds, {padding: [50, 50]}); }
                </script>
              </body>
              </html>
            `}}
            javaScriptEnabled={true}
            style={{ flex: 1 }}
          />
        </View>
      </Modal>
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
    paddingTop: Platform.OS === 'android' ? 45 : 60,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginRight: 8,
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
  mapButton: {
    flexDirection: 'row',
    height: 38,
    borderRadius: 19,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  addressBox: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    fontSize: 13,
    flex: 1,
    marginLeft: 6,
    fontWeight: '500',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 45 : 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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