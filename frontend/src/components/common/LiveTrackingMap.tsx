import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '../../context/ThemeContext';

interface LiveTrackingMapProps {
  progress: number; // 0.0 to 1.0
  destinationLat?: number;
  destinationLng?: number;
  warehouseLat?: number;
  warehouseLng?: number;
  height?: number;
}

export default function LiveTrackingMap({
  progress,
  destinationLat = 41.0082, // Default to Istanbul
  destinationLng = 28.9784,
  warehouseLat = 41.0300, // Example warehouse location
  warehouseLng = 28.9800,
  height = 300
}: LiveTrackingMapProps) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef<WebView>(null);

  // Calculate current simulated courier position
  const currentLat = warehouseLat + (destinationLat - warehouseLat) * progress;
  const currentLng = warehouseLng + (destinationLng - warehouseLng) * progress;

  // We use Leaflet with a polyline from warehouse to destination, and a moving marker.
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossorigin=""/>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" crossorigin=""></script>
      <style>
        body { padding: 0; margin: 0; }
        html, body, #map { height: 100%; width: 100%; }
        /* Custom courier icon styling */
        .courier-icon {
          background-color: ${theme.accent};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
          width: 24px;
          height: 24px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var warehouse = [${warehouseLat}, ${warehouseLng}];
        var destination = [${destinationLat}, ${destinationLng}];
        var current = [${currentLat}, ${currentLng}];

        var map = L.map('map');
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap'
        }).addTo(map);

        // Draw route line
        var routeLine = L.polyline([warehouse, destination], {color: '${theme.border}', weight: 4, dashArray: '5, 10'}).addTo(map);
        
        // Draw traveled route
        var traveledLine = L.polyline([warehouse, current], {color: '${theme.accent}', weight: 5}).addTo(map);

        // Add markers
        var warehouseIcon = L.divIcon({className: 'courier-icon', html: '🏢', iconSize: [30, 30]});
        var destIcon = L.divIcon({className: 'courier-icon', html: '🏠', iconSize: [30, 30], iconAnchor: [15, 15]});
        var courierIcon = L.divIcon({className: 'courier-icon', html: '🛵', iconSize: [36, 36], iconAnchor: [18, 18]});

        L.marker(warehouse, {icon: warehouseIcon}).addTo(map);
        L.marker(destination, {icon: destIcon}).addTo(map);
        var courierMarker = L.marker(current, {icon: courierIcon}).addTo(map);

        // Fit bounds to show the whole route
        map.fitBounds(routeLine.getBounds(), {padding: [30, 30]});
        
        // Listen for React Native updates (if we want to update position dynamically)
        window.addEventListener('message', function(event) {
          try {
            var data = JSON.parse(event.data);
            if (data.type === 'update_progress') {
              var newLat = warehouse[0] + (destination[0] - warehouse[0]) * data.progress;
              var newLng = warehouse[1] + (destination[1] - warehouse[1]) * data.progress;
              courierMarker.setLatLng([newLat, newLng]);
              traveledLine.setLatLngs([warehouse, [newLat, newLng]]);
            }
          } catch(e) {}
        });
      </script>
    </body>
    </html>
  `;

  // Update progress dynamically via injected JS instead of full reload
  useEffect(() => {
    if (!loading && webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        window.postMessage(JSON.stringify({ type: 'update_progress', progress: ${progress} }), '*');
        true;
      `);
    }
  }, [progress, loading]);

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
        onLoadEnd={() => setLoading(false)}
        javaScriptEnabled={true}
        style={{ flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    position: 'relative'
  },
  loadingContainer: {
    ...StyleSheet.absoluteFill as any,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  }
});
