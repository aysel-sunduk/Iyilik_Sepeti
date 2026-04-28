import React, { useState } from 'react';
import { FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const myDonations = [
  {
    id: 1,
    productName: 'Okul Çantası',
    quantity: 2,
    date: '15.01.2024',
    status: 'delivered',
    proofImage: 'https://picsum.photos/200/300?random=1',
    deliveryNote: 'Van Deprem Bölgesine ulaştırıldı',
    beneficiary: 'Ayşe (7 yaş)',
    donationType: 'anonymous',
  },
  {
    id: 2,
    productName: 'Battaniye',
    quantity: 5,
    date: '10.01.2024',
    status: 'shipping',
    proofImage: null,
    deliveryNote: 'Kargoda, bu hafta ulaşacak',
    donationType: 'friend',
    friendName: 'Mehmet Demir',
    message: 'Doğum günün kutlu olsun kardeşim!',
  },
  {
    id: 3,
    productName: 'Mama (15kg)',
    quantity: 3,
    date: '05.01.2024',
    status: 'pending',
    proofImage: null,
    deliveryNote: 'Hazırlanıyor, hayvan barınağına iletilecek',
    donationType: 'anonymous',
  },
];

export default function DonationTrackingScreen() {
  const { theme } = useTheme();
  const [selectedProof, setSelectedProof] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return '#10B981';
      case 'shipping': return '#F59E0B';
      default: return '#9CA3AF';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return '✅ Teslim Edildi';
      case 'shipping': return '🚚 Yolda';
      default: return '⏳ Hazırlanıyor';
    }
  };

  const renderTimeline = (status: string) => {
    const steps = [
      { id: 'pending', label: 'Hazırlanıyor', icon: '📦' },
      { id: 'shipping', label: 'Yolda', icon: '🚚' },
      { id: 'delivered', label: 'Teslim Edildi', icon: '🏠' },
    ];
    
    const currentIndex = steps.findIndex(s => s.id === status);

    return (
      <View style={styles.timelineContainer}>
        {steps.map((step, index) => (
          <View key={step.id} style={styles.timelineStep}>
            <View style={styles.dotContainer}>
              <View style={[
                styles.dot, 
                { backgroundColor: index <= currentIndex ? theme.accent : '#D1D5DB' }
              ]} />
              {index < steps.length - 1 && (
                <View style={[
                  styles.line, 
                  { backgroundColor: index < currentIndex ? theme.accent : '#D1D5DB' }
                ]} />
              )}
            </View>
            <Text style={[
              styles.stepLabel, 
              { color: index <= currentIndex ? theme.text1 : theme.text3, fontWeight: index === currentIndex ? 'bold' : 'normal' }
            ]}>
              {step.label}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { backgroundColor: theme.accent }]}>
        <Text style={styles.headerTitle}>🎁 Bağışlarım</Text>
        <Text style={styles.headerSub}>İyilik yolculuğunu buradan takip et!</Text>
      </View>

      <FlatList
        data={myDonations}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.productName, { color: theme.text1 }]}>
                {item.productName} x{item.quantity}
              </Text>
              <Text style={[styles.date, { color: theme.text4 }]}>{item.date}</Text>
            </View>

            {renderTimeline(item.status)}

            {item.donationType === 'friend' && item.friendName && (
              <View style={[styles.friendBadge, { backgroundColor: theme.accent + '10' }]}>
                <Text style={[styles.friendText, { color: theme.accent }]}>
                  🎁 {item.friendName} adına bağışlandı
                </Text>
                {item.message && (
                  <Text style={[styles.messageText, { color: theme.text3 }]}>"{item.message}"</Text>
                )}
              </View>
            )}

            <View style={styles.divider} />

            <View style={styles.cardFooter}>
              <Text style={[styles.note, { color: theme.text2, flex: 1 }]}>📍 {item.deliveryNote}</Text>
              {item.proofImage && (
                <TouchableOpacity 
                  style={[styles.proofBadge, { backgroundColor: '#10B98115' }]}
                  onPress={() => openProofModal(item.proofImage!)}
                >
                  <Text style={{ color: '#10B981', fontWeight: 'bold', fontSize: 12 }}>📸 Kanıt</Text>
                </TouchableOpacity>
              )}
            </View>

            {item.beneficiary && item.status === 'delivered' && (
              <View style={[styles.beneficiary, { backgroundColor: '#3B82F610' }]}>
                <Text style={[styles.beneficiaryText, { color: '#3B82F6' }]}>
                  🙏 {item.beneficiary} isimli çocuğumuza ulaştı!
                </Text>
              </View>
            )}
          </View>
        )}
      />

      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.text1 }]}>📸 Bağış Kanıtı</Text>
            {selectedProof && <Image source={{ uri: selectedProof }} style={styles.proofImage} resizeMode="contain" />}
            <Text style={[styles.modalNote, { color: theme.text3 }]}>Bağış ekibimiz tarafından teslim anı görseli</Text>
            <TouchableOpacity style={[styles.closeButton, { backgroundColor: theme.accent }]} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSub: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    marginTop: 4,
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
  },
  timelineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  timelineStep: {
    alignItems: 'center',
    flex: 1,
  },
  dotContainer: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    zIndex: 1,
  },
  line: {
    position: 'absolute',
    top: 6,
    left: '50%',
    width: '100%',
    height: 2,
  },
  stepLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  friendBadge: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
  },
  friendText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: '#00000005',
    marginBottom: 15,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  note: {
    fontSize: 13,
    lineHeight: 18,
  },
  proofBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  beneficiary: {
    padding: 10,
    borderRadius: 10,
    marginTop: 12,
    alignItems: 'center',
  },
  beneficiaryText: {
    fontSize: 13,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  proofImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
  },
  modalNote: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});