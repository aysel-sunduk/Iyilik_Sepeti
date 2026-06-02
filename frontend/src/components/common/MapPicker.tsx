import React, { useRef, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '../../context/ThemeContext';

interface MapPickerProps {
  initialLatitude?: number;
  initialLongitude?: number;
  onLocationSelect: (lat: number, lng: number) => void;
  height?: number;
}

export default function MapPicker({
  initialLatitude = 41.0082,
  initialLongitude = 28.9784,
  onLocationSelect,
  height = 300
}: MapPickerProps) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(
    initialLatitude && initialLongitude ? {lat: initialLatitude, lng: initialLongitude} : null
  );
  
  const webViewRef = useRef<WebView>(null);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
      <style>
        body { padding: 0; margin: 0; }
        html, body, #map { height: 100%; width: 100%; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([${selectedLocation?.lat || initialLatitude}, ${selectedLocation?.lng || initialLongitude}], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        var marker = null;
        ${selectedLocation ? `marker = L.marker([${selectedLocation.lat}, ${selectedLocation.lng}]).addTo(map);` : ''}

        map.on('click', function(e) {
          if(marker) {
            map.removeLayer(marker);
          }
          marker = L.marker(e.latlng).addTo(map);
          window.ReactNativeWebView.postMessage(JSON.stringify({
            lat: e.latlng.lat,
            lng: e.latlng.lng
          }));
        });
      </script>
    </body>
    </html>
  `;

  const onMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.lat && data.lng) {
        setSelectedLocation(data);
        onLocationSelect(data.lat, data.lng);
      }
    } catch (error) {
      console.error("Map message parsing error:", error);
    }
  };

  return (
    <View style={[styles.container, { height, borderColor: theme.border }]}>
      {loading && (
        <View style={[styles.loadingContainer, { backgroundColor: theme.surface }]}>
          <ActivityIndicator size="large" color={theme.accent} />
          <Text style={{ color: theme.text3, marginTop: 10 }}>Harita Yükleniyor...</Text>
        </View>
      )}
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        onMessage={onMessage}
        onLoadEnd={() => setLoading(false)}
        javaScriptEnabled={true}
        style={{ flex: 1 }}
      />
      {selectedLocation && (
        <View style={[styles.selectedInfo, { backgroundColor: theme.accent }]}>
          <Text style={styles.selectedText}>Konum Seçildi ✓</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    position: 'relative',
    marginBottom: 15
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },
  selectedInfo: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    opacity: 0.9,
    zIndex: 20
  },
  selectedText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12
  }
});
