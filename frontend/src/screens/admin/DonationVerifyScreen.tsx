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
                <style>
                  body { padding: 0; margin: 0; font-family: -apple-system, system-ui, sans-serif; }
                  html, body, #map { height: 100%; width: 100%; }
                  .custom-pin {
                    font-size: 36px;
                    text-shadow: 0 3px 6px rgba(0,0,0,0.3);
                    text-align: center;
                    animation: bounce 2s infinite ease-in-out;
                  }
                  @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                  }
                  .custom-label {
                    background: white; border: none; border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1); font-size: 11px;
                    font-weight: 600; padding: 4px 8px; color: #374151;
                    white-space: nowrap; max-width: 150px; overflow: hidden; text-overflow: ellipsis;
                  }
                  .leaflet-tooltip-bottom:before { border-bottom-color: white; }
                  .leaflet-tooltip-top:before { border-top-color: white; }
                  .pulsing-dot {
                    width: 20px; height: 20px; background-color: #10B981; border-radius: 50%;
                    border: 3px solid white; box-shadow: 0 0 10px rgba(16, 185, 129, 0.6);
                    animation: pulse 2s infinite;
                  }
                  @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
                    70% { box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
                  }
                </style>
              </head>
              <body>
                <div id="map"></div>
                <script>
                  var map = L.map('map', { zoomControl: false }).setView([39.9208, 32.8541], 6);
                  L.control.zoom({ position: 'bottomright' }).addTo(map);
                  
                  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { 
                    attribution: '© OpenStreetMap & CartoDB',
                    maxZoom: 19
                  }).addTo(map);
                  
                  var customIcon = L.divIcon({
                    className: 'custom-marker',
                    html: '<div class="custom-pin">📍</div>',
                    iconSize: [40, 40],
                    iconAnchor: [20, 40],
                    popupAnchor: [0, -35]
                  });

                  var bounds = [];
                  var donationsData = ${JSON.stringify(donations || [])};
                  
                  // Türkiye Geneli Lojistik Dağıtım Şehirleri
                  var cities = [
                    { name: "İstanbul", lat: 41.0082, lng: 28.9784 },
                    { name: "Ankara", lat: 39.9208, lng: 32.8541 },
                    { name: "İzmir", lat: 38.4237, lng: 27.1428 },
                    { name: "Antalya", lat: 36.8969, lng: 30.7133 },
                    { name: "Gaziantep", lat: 37.0662, lng: 37.3833 },
                    { name: "Trabzon", lat: 41.0027, lng: 39.7168 },
                    { name: "Adana", lat: 37.0000, lng: 35.3213 },
                    { name: "Erzurum", lat: 39.9043, lng: 41.2679 },
                    { name: "Van", lat: 38.4965, lng: 43.3853 }
                  ];
                  
                  donationsData.forEach(function(d, index) {
                    var center = cities[index % cities.length];
                    
                    // Şehrin içinde hafif bir dağılım
                    var lat = d.latitude || (center.lat + (Math.random() * 0.04 - 0.02));
                    var lng = d.longitude || (center.lng + (Math.random() * 0.04 - 0.02));
                    
                    var marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
                    
                    var productName = (d.productName || 'Bağış Paketi').replace(/</g, "&lt;");
                    var donor = (d.donorName || 'Gizli Kahraman').replace(/</g, "&lt;");
                    
                    var popupHtml = "<div style='text-align:center;'>" +
                                    "<span style='color:#10B981; font-weight:bold; font-size:14px;'>📍 Yardım Merkezi</span><br/>" +
                                    "<span style='color:#374151; font-weight:bold; font-size:13px;'>" + center.name + " Teslimat Noktası</span><br/>" +
                                    "<hr style='margin:6px 0; border:0; border-top:1px solid #E5E7EB;'/>" +
                                    "<span style='color:#6B7280; font-size:12px;'>" + (d.addressText ? d.addressText.replace(/</g, "&lt;") : "Merkez Depo Adresi") + "</span>" +
                                    "</div>";
                    
                    marker.bindPopup(popupHtml);
                    bounds.push([lat, lng]);
                  });
                  
                  if(bounds.length > 0) { 
                    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 }); 
                  } else {
                    L.popup()
                      .setLatLng([39.9208, 32.8541])
                      .setContent("Şu an Türkiye genelinde teslimat bekleyen bağış yok.")
                      .openOn(map);
                  }

                  // Teslimat Aracının Konumunu Bul
                  map.locate({setView: false, enableHighAccuracy: true});
                  
                  // Başarılı olursa kendi konumunu koy
                  map.on('locationfound', function(e) {
                    var myIcon = L.divIcon({
                      className: 'my-location',
                      html: '<div class="pulsing-dot"></div>',
                      iconSize: [20, 20],
                      iconAnchor: [10, 10]
                    });
                    var myLocMarker = L.marker(e.latlng, {icon: myIcon}).addTo(map);
                    myLocMarker.bindTooltip("Senin Konumun", {direction: 'top', className: 'custom-label', permanent: true, offset: [0, -10]});
                    
                    bounds.push([e.latlng.lat, e.latlng.lng]);
                    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
                  });

                  // Emülatör GPS kapalıysa veya hata verirse yeşil pini zorla (fallback) göster
                  map.on('locationerror', function(e) {
                    var myIcon = L.divIcon({
                      className: 'my-location',
                      html: '<div class="pulsing-dot"></div>',
                      iconSize: [20, 20],
                      iconAnchor: [10, 10]
                    });
                    // Rastgele ama merkezi bir konum (Ankara dolayları)
                    var fallbackLoc = [39.9, 32.8];
                    var myLocMarker = L.marker(fallbackLoc, {icon: myIcon}).addTo(map);
                    myLocMarker.bindTooltip("Senin Konumun", {direction: 'top', className: 'custom-label', permanent: true, offset: [0, -10]});
                  });
                </script>
              </body>
              </html>
            `}}
            javaScriptEnabled={true}
            geolocationEnabled={true}
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