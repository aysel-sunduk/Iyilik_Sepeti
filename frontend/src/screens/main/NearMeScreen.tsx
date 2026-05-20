import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Dimensions, Platform, Alert } from 'react-native';
import Svg, { Circle, Path, G, Rect } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api/api';

const { width } = Dimensions.get('window');

// Mock reference coordinate nodes to draw a visual map overlay
// Let's define the map coordinate scale: latitude 40.95 - 41.10, longitude 28.95 - 29.15
const mapLeft = 28.95;
const mapRight = 29.15;
const mapTop = 41.10;
const mapBottom = 40.95;

interface CoordinateOption {
  label: string;
  latitude: number;
  longitude: number;
}

const coordinateOptions: CoordinateOption[] = [
  { label: 'Kadıköy (Ev)', latitude: 40.9900, longitude: 29.0250 },
  { label: 'Beşiktaş', latitude: 41.0420, longitude: 29.0080 },
  { label: 'Mecidiyeköy', latitude: 41.0650, longitude: 28.9950 },
  { label: 'Ataşehir', latitude: 40.9850, longitude: 29.1100 },
];

export default function NearMeScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [selectedCoord, setSelectedCoord] = useState<CoordinateOption>(coordinateOptions[0]);
  const [hubs, setHubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHub, setSelectedHub] = useState<any>(null);
  const [radius, setRadius] = useState<number>(15);

  useEffect(() => {
    fetchHubs();
  }, [selectedCoord, radius]);

  const fetchHubs = async () => {
    try {
      setLoading(true);
      const res = await api.hubs.getNear(selectedCoord.latitude, selectedCoord.longitude, radius);
      // Backend returns ApiResponse, let's unpack
      if (res && (res as any).data) {
        setHubs((res as any).data);
      } else {
        setHubs(res || []);
      }
    } catch (error) {
      console.error('Fetch hubs error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Convert GPS coordinates to local SVG viewBox (0-300)
  const gpsToSvg = (lat: number, lng: number) => {
    const x = ((lng - mapLeft) / (mapRight - mapLeft)) * 300;
    // Y is inverted since SVG y starts at top
    const y = ((mapTop - lat) / (mapTop - mapBottom)) * 200;
    return { x, y };
  };

  const userSvg = gpsToSvg(selectedCoord.latitude, selectedCoord.longitude);

  const getHubIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'HUB': return '🏠';
      case 'SHELTER': return '🐾';
      case 'EVENT': return '📅';
      default: return '📍';
    }
  };

  const getHubColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'HUB': return '#4F46E5';
      case 'SHELTER': return '#FB923C';
      case 'EVENT': return '#10B981';
      default: return '#EF4444';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ fontSize: 24, color: theme.text1 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text1 }]}>Yakınımdaki İyilik Noktaları</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Simulate Coordinates Panel */}
        <Text style={[styles.sectionTitle, { color: theme.text1 }]}>Konumunuzu Değiştirin (Simülasyon)</Text>
        <View style={[styles.simulatorCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={{ color: theme.text3, fontSize: 13, marginBottom: 10 }}>
            Uygulamayı test etmek için farklı başlangıç konumları seçerek etrafınızdaki iyilik merkezlerinin nasıl sıralandığını ve mesafesini görebilirsiniz:
          </Text>
          <View style={styles.coordButtonGrid}>
            {coordinateOptions.map((opt, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  setSelectedCoord(opt);
                  setSelectedHub(null);
                }}
                style={[
                  styles.coordBtn,
                  selectedCoord.label === opt.label
                    ? { backgroundColor: theme.accent }
                    : { backgroundColor: theme.bg, borderColor: theme.border, borderWidth: 1 }
                ]}
              >
                <Text
                  style={[
                    styles.coordBtnText,
                    selectedCoord.label === opt.label ? { color: 'white' } : { color: theme.text2 }
                  ]}
                >
                  📍 {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Beautiful Stylized SVG Map */}
        <Text style={[styles.sectionTitle, { color: theme.text1 }]}>İyilik Haritası</Text>
        <View style={[styles.mapContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Svg viewBox="0 0 300 200" width="100%" height={220}>
            {/* Draw water / Sea of Marmara bottom part */}
            <Path d="M 0 150 Q 150 170 300 130 L 300 200 L 0 200 Z" fill="#E0F2FE" opacity={theme.isDark ? 0.3 : 0.8} />
            
            {/* Draw main road lines for decorative premium feeling */}
            <Path d="M 10 90 Q 150 60 290 80" fill="none" stroke={theme.isDark ? '#374151' : '#E5E7EB'} strokeWidth={3} strokeDasharray="5,5" />
            <Path d="M 120 10 Q 160 100 180 190" fill="none" stroke={theme.isDark ? '#374151' : '#E5E7EB'} strokeWidth={2} strokeDasharray="3,3" />

            {/* Draw User location pulse */}
            <G>
              <Circle cx={userSvg.x} cy={userSvg.y} r={16} fill="#3B82F6" opacity={0.15} />
              <Circle cx={userSvg.x} cy={userSvg.y} r={10} fill="#3B82F6" opacity={0.3} />
              <Circle cx={userSvg.x} cy={userSvg.y} r={5} fill="#3B82F6" />
            </G>

            {/* Draw Hub markers */}
            {hubs.map((hub, idx) => {
              const svgCoord = gpsToSvg(hub.latitude, hub.longitude);
              const color = getHubColor(hub.type);
              const isSelected = selectedHub?.id === hub.id;
              return (
                <G key={hub.id || idx} onPress={() => setSelectedHub(hub)}>
                  {/* Pulse ring for selected */}
                  {isSelected && (
                    <Circle cx={svgCoord.x} cy={svgCoord.y} r={14} fill={color} opacity={0.25} />
                  )}
                  {/* Pin Circle */}
                  <Circle
                    cx={svgCoord.x}
                    cy={svgCoord.y}
                    r={isSelected ? 10 : 8}
                    fill={color}
                  />
                  {/* Tiny white center dot */}
                  <Circle cx={svgCoord.x} cy={svgCoord.y} r={3} fill="white" />
                </G>
              );
            })}
          </Svg>
          
          <View style={styles.mapLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#4F46E5' }]} />
              <Text style={[styles.legendText, { color: theme.text2 }]}>Toplama Deposu (HUB)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#FB923C' }]} />
              <Text style={[styles.legendText, { color: theme.text2 }]}>Barınak (SHELTER)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
              <Text style={[styles.legendText, { color: theme.text2 }]}>Etkinlik (EVENT)</Text>
            </View>
          </View>
        </View>

        {/* Selected Hub Detail Card */}
        {selectedHub && (
          <View style={[styles.selectedCard, { backgroundColor: theme.surface, borderColor: theme.accent + '60', borderWidth: 1 }]}>
            <View style={styles.selectedHeader}>
              <Text style={{ fontSize: 24, marginRight: 10 }}>{getHubIcon(selectedHub.type)}</Text>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={[styles.selectedTypeBadge, { color: getHubColor(selectedHub.type), backgroundColor: getHubColor(selectedHub.type) + '15' }]}>
                    {selectedHub.type === 'HUB' ? 'Depo & Merkez' : selectedHub.type === 'SHELTER' ? 'Barınak' : 'Saha Etkinliği'}
                  </Text>
                  <Text style={[styles.selectedDistText, { color: theme.accent }]}>
                    {selectedHub.distanceKm.toFixed(1)} km uzakta
                  </Text>
                </View>
                <Text style={[styles.selectedTitle, { color: theme.text1 }]}>{selectedHub.name}</Text>
              </View>
            </View>
            
            {selectedHub.imageUrl && (
              <Image source={{ uri: selectedHub.imageUrl }} style={styles.selectedImage} />
            )}
            
            <Text style={[styles.selectedDesc, { color: theme.text2 }]}>{selectedHub.description}</Text>
            <Text style={[styles.selectedAddress, { color: theme.text3 }]}>📍 {selectedHub.address}</Text>

            <TouchableOpacity 
              style={[styles.routeButton, { backgroundColor: theme.accent }]}
              onPress={() => {
                // Get simulated route directions
                Alert.alert('Güzergah Simülasyonu', `Başlangıç: ${selectedCoord.label}\nHedef: ${selectedHub.name}\n\nİyilik Express kuryemiz ile bu mesafeyi yaklaşık ${Math.max(10, Math.round(selectedHub.distanceKm * 3))} dakikada kat edebilirsiniz!`);
              }}
            >
              <Text style={styles.routeBtnText}>Yol Tarifi Simülasyonu</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* List of nearby hubs */}
        <Text style={[styles.sectionTitle, { color: theme.text1 }]}>Noktalar Listesi ({hubs.length} adet)</Text>
        
        {loading ? (
          <ActivityIndicator size="small" color={theme.accent} style={{ marginVertical: 20 }} />
        ) : hubs.length === 0 ? (
          <Text style={{ textAlign: 'center', color: theme.text3, marginVertical: 30 }}>Yakınınızda iyilik noktası bulunamadı.</Text>
        ) : (
          hubs.map((hub) => (
            <TouchableOpacity
              key={hub.id}
              activeOpacity={0.8}
              style={[
                styles.hubItemCard,
                { backgroundColor: theme.surface },
                selectedHub?.id === hub.id && { borderColor: getHubColor(hub.type), borderWidth: 1.5 }
              ]}
              onPress={() => setSelectedHub(hub)}
            >
              <View style={styles.hubItemRow}>
                <View style={[styles.hubIconCircle, { backgroundColor: getHubColor(hub.type) + '15' }]}>
                  <Text style={{ fontSize: 20 }}>{getHubIcon(hub.type)}</Text>
                </View>
                
                <View style={{ flex: 1, marginLeft: 15 }}>
                  <Text style={[styles.hubItemName, { color: theme.text1 }]} numberOfLines={1}>{hub.name}</Text>
                  <Text style={[styles.hubItemAddress, { color: theme.text3 }]} numberOfLines={1}>{hub.address}</Text>
                  <Text style={[styles.hubItemDistance, { color: theme.accent }]}>
                    {hub.distanceKm.toFixed(1)} km uzakta
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: { fontSize: 16, fontWeight: 'bold' },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  scrollContent: { padding: 20 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 12, marginTop: 10 },
  simulatorCard: { borderRadius: 16, padding: 15, marginBottom: 20, borderWidth: 1 },
  coordButtonGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  coordBtn: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, minWidth: '47%', alignItems: 'center' },
  coordBtnText: { fontSize: 12, fontWeight: 'bold' },
  mapContainer: { borderRadius: 20, overflow: 'hidden', borderWidth: 1, padding: 10, marginBottom: 20 },
  mapLegend: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 10, marginTop: 5, justifyContent: 'space-around' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 10, fontWeight: '500' },
  selectedCard: { borderRadius: 20, padding: 16, marginBottom: 20 },
  selectedHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  selectedTypeBadge: { fontSize: 10, fontWeight: 'bold', paddingVertical: 2, paddingHorizontal: 8, borderRadius: 6, alignSelf: 'flex-start' },
  selectedDistText: { fontSize: 11, fontWeight: 'bold' },
  selectedTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 6 },
  selectedImage: { width: '100%', height: 120, borderRadius: 12, marginVertical: 12 },
  selectedDesc: { fontSize: 13, lineHeight: 18, marginBottom: 10 },
  selectedAddress: { fontSize: 12, fontWeight: '500', marginBottom: 15 },
  routeButton: { height: 45, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  routeBtnText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  hubItemCard: { borderRadius: 16, padding: 14, marginBottom: 12, elevation: 1 },
  hubItemRow: { flexDirection: 'row', alignItems: 'center' },
  hubIconCircle: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  hubItemName: { fontSize: 14, fontWeight: 'bold' },
  hubItemAddress: { fontSize: 11, marginVertical: 2 },
  hubItemDistance: { fontSize: 12, fontWeight: 'bold' }
});
