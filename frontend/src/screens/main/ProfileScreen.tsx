import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Dimensions, Image, Modal } from 'react-native';
import Svg, { Path, Polyline, Line } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import { logout } from '../../redux/slices/authSlice';
import { RootState } from '../../redux/store';

const { width } = Dimensions.get('window');

// Mock Data for Badges and Certificates
const MOCK_BADGES = [
  { id: 1, name: 'İlk Adım', emoji: '🌱', color: '#10B981', desc: 'İlk bağışını yaptın!' },
  { id: 2, name: 'Patidostu', emoji: '🐾', color: '#FB923C', desc: 'Sokak hayvanlarına destek oldun.' },
  { id: 3, name: 'Eğitim Gönüllüsü', emoji: '📚', color: '#8B5CF6', desc: 'Eğitime katkı sağladın.' },
  { id: 4, name: 'Hayat Kurtaran', emoji: '❤️', color: '#EF4444', desc: '10+ hayata dokundun.' },
];

const MOCK_CERTIFICATES = [
  { id: 1, date: '12.04.2026', title: 'Deprem Desteği', image: '🎒' },
  { id: 2, date: '05.04.2026', title: 'Sokak Hayvanları', image: '🐾' },
];

const LogoutIcon = ({ color }: { color: string }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <Polyline points="16 17 21 12 16 7" />
    <Line x1="21" y1="12" x2="9" y2="12" />
  </Svg>
);

export default function ProfileScreen({ navigation }: any) {
  const { theme, themeMode, setThemeMode } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [logoutSuccessVisible, setLogoutSuccessVisible] = useState(false);
  
  // Mock Stats
  const impactPoints = 1250;
  const livesTouched = 12;
  const volunteerLevel = "Altın Gönüllü";
  const levelProgress = 0.75; // 75%

  const handleLogoutPress = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = () => {
    setLogoutModalVisible(false);
    setLogoutSuccessVisible(true);
    
    // Show success modal for 1.5 seconds then actually logout
    setTimeout(() => {
      setLogoutSuccessVisible(false);
      dispatch(logout());
    }, 1500);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} showsVerticalScrollIndicator={false}>
        {/* Header Profile Section */}
        <View style={[styles.header, { backgroundColor: theme.surface }]}>
          <View style={styles.headerTop}>
            <Text style={[styles.headerTitle, { color: theme.text1 }]}>Profilim</Text>
            <TouchableOpacity style={styles.settingsBtn}><Text style={{fontSize: 20}}>⚙️</Text></TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <View style={[styles.avatar, { backgroundColor: theme.accent + '20' }]}>
                <Text style={styles.avatarEmoji}>🦁</Text>
              </View>
              <TouchableOpacity style={styles.editAvatarBtn}>
                <Text style={{fontSize: 12}}>✏️</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.userNameContainer}>
              <Text style={[styles.userName, { color: theme.text1 }]}>{user?.firstName || 'Asel'} {user?.lastName || 'Sunduk'}</Text>
              <View style={[styles.levelBadge, { backgroundColor: '#F59E0B20' }]}>
                <Text style={[styles.levelText, { color: '#F59E0B' }]}>✨ {volunteerLevel}</Text>
              </View>
            </View>
          </View>

          {/* Level Progress Bar */}
          <View style={styles.levelProgressSection}>
            <View style={styles.levelLabels}>
              <Text style={[styles.levelLabel, { color: theme.text3 }]}>Level 12</Text>
              <Text style={[styles.levelLabel, { color: theme.text3 }]}>Next: 250 Puan</Text>
            </View>
            <View style={[styles.progressBarBg, { backgroundColor: theme.bg }]}>
              <View style={[styles.progressBarFill, { width: `${levelProgress * 100}%`, backgroundColor: theme.accent }]} />
            </View>
          </View>
        </View>

        {/* Impact Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statBox, { backgroundColor: theme.surface }]}>
            <Text style={styles.statValue}>{impactPoints}</Text>
            <Text style={[styles.statLabel, { color: theme.text3 }]}>İyilik Puanı</Text>
            <Text style={styles.statEmoji}>⭐</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: theme.surface }]}>
            <Text style={styles.statValue}>{livesTouched}</Text>
            <Text style={[styles.statLabel, { color: theme.text3 }]}>Dokunulan Hayat</Text>
            <Text style={styles.statEmoji}>🤝</Text>
          </View>
        </View>

        {/* Badges Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text1 }]}>🏆 Rozetlerin</Text>
            <TouchableOpacity><Text style={[styles.seeAll, { color: theme.accent }]}>Tümü</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgesScroll}>
            {MOCK_BADGES.map(badge => (
              <TouchableOpacity key={badge.id} style={[styles.badgeItem, { backgroundColor: theme.surface }]}>
                <View style={[styles.badgeIcon, { backgroundColor: badge.color + '15' }]}>
                  <Text style={{fontSize: 24}}>{badge.emoji}</Text>
                </View>
                <Text style={[styles.badgeName, { color: theme.text1 }]} numberOfLines={1}>{badge.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Certificate Gallery */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text1 }]}>📄 Sertifika Arşivin</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.certScroll}>
            {MOCK_CERTIFICATES.map(cert => (
              <TouchableOpacity key={cert.id} style={[styles.certCard, { backgroundColor: theme.surface }]}>
                <View style={styles.certIcon}><Text style={{fontSize: 32}}>{cert.image}</Text></View>
                <View style={styles.certInfo}>
                  <Text style={[styles.certTitle, { color: theme.text1 }]} numberOfLines={1}>{cert.title}</Text>
                  <Text style={[styles.certDate, { color: theme.text3 }]}>{cert.date}</Text>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={[styles.addCertCard, { borderColor: theme.border }]}>
              <Text style={{fontSize: 24, color: theme.text4}}>+</Text>
              <Text style={{fontSize: 12, color: theme.text4, marginTop: 5}}>Yeni Bağış</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* General Settings Menu */}
        <View style={[styles.menuSection, { backgroundColor: theme.surface }]}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>📦</Text>
            <Text style={[styles.menuText, { color: theme.text1 }]}>Sipariş Geçmişi</Text>
            <Text style={[styles.menuArrow, { color: theme.text4 }]}>→</Text>
          </TouchableOpacity>
          <View style={styles.menuDivider} />
          
          {/* Görünüm Ayarları Menüsü */}
          <TouchableOpacity style={styles.menuItem} onPress={() => setThemeModalVisible(true)}>
            <Text style={styles.menuIcon}>🎨</Text>
            <Text style={[styles.menuText, { color: theme.text1 }]}>Görünüm Ayarları</Text>
            <Text style={[styles.menuArrow, { color: theme.text4 }]}>→</Text>
          </TouchableOpacity>
          <View style={styles.menuDivider} />

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('AddCard')}>
            <Text style={styles.menuIcon}>💳</Text>
            <Text style={[styles.menuText, { color: theme.text1 }]}>Kayıtlı Kartlarım</Text>
            <Text style={[styles.menuArrow, { color: theme.text4 }]}>→</Text>
          </TouchableOpacity>
          <View style={styles.menuDivider} />
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('AddAddress')}>
            <Text style={styles.menuIcon}>📍</Text>
            <Text style={[styles.menuText, { color: theme.text1 }]}>Adreslerim</Text>
            <Text style={[styles.menuArrow, { color: theme.text4 }]}>→</Text>
          </TouchableOpacity>
          <View style={styles.menuDivider} />
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={handleLogoutPress}
          >
            <View style={styles.menuIconContainer}>
              <LogoutIcon color={theme.error} />
            </View>
            <Text style={[styles.menuText, { color: theme.error }]}>Oturumu Kapat</Text>
            <Text style={[styles.menuArrow, { color: theme.text4 }]}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Tema Seçim Modalı */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={themeModalVisible}
          onRequestClose={() => setThemeModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <TouchableOpacity 
              style={styles.closeModal} 
              onPress={() => setThemeModalVisible(false)}
            >
              <Text style={{ fontSize: 20, color: theme.text3 }}>✕</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.text1 }]}>🎨 Görünüm</Text>
              <Text style={[styles.modalMessage, { color: theme.text3, marginBottom: 20 }]}>Uygulama temasını dilediğin gibi ayarla</Text>
              
              {(['light', 'dark', 'system'] as const).map((mode) => (
                <TouchableOpacity 
                  key={mode}
                  style={[
                    styles.themeMenuOption, 
                    { backgroundColor: themeMode === mode ? theme.accent + '15' : 'transparent', borderColor: themeMode === mode ? theme.accent : theme.border }
                  ]}
                  onPress={() => {
                    setThemeMode(mode);
                    setThemeModalVisible(false);
                  }}
                >
                  <Text style={[styles.themeMenuText, { color: themeMode === mode ? theme.accent : theme.text1 }]}>
                    {mode === 'light' ? '☀️ Açık Tema' : mode === 'dark' ? '🌙 Koyu Tema' : '📱 Sistem Varsayılanı'}
                  </Text>
                  {themeMode === mode && <Text style={{color: theme.accent, fontWeight: 'bold'}}>✓</Text>}
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: theme.isDark ? theme.bg : '#F3F4F6', marginTop: 10, width: '100%' }]} 
                onPress={() => setThemeModalVisible(false)}
              >
                <Text style={{ color: theme.text1, fontWeight: 'bold' }}>Kapat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Logout Confirmation Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={logoutModalVisible}
          onRequestClose={() => setLogoutModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
              <TouchableOpacity 
                style={styles.closeModal} 
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={{ fontSize: 20, color: theme.text3 }}>✕</Text>
              </TouchableOpacity>
              
              <Text style={[styles.modalTitle, { color: theme.text1, marginTop: 10 }]}>Çıkış Yap</Text>
              <Text style={[styles.modalMessage, { color: theme.text2 }]}>Oturumu kapatmak istediğinize emin misiniz?</Text>
              
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={[styles.modalButton, { backgroundColor: theme.isDark ? theme.bg : '#F3F4F6' }]} 
                  onPress={() => setLogoutModalVisible(false)}
                >
                  <Text style={{ color: theme.text2, fontSize: 16, fontWeight: 'bold' }}>İptal</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, { backgroundColor: theme.error }]} 
                  onPress={confirmLogout}
                >
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Çıkış Yap</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Logout Success Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={logoutSuccessVisible}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.surface, paddingVertical: 40 }]}>
              <View style={[styles.successRing, { borderColor: theme.accent + '20' }]}>
                <View style={[styles.successCircle, { backgroundColor: theme.accent }]}>
                  <Text style={{ fontSize: 32, color: 'white' }}>✓</Text>
                </View>
              </View>
              <Text style={[styles.modalTitle, { color: theme.text1, marginTop: 20 }]}>Başarıyla Çıkış Yapıldı</Text>
              <Text style={[styles.modalMessage, { color: theme.text3, marginBottom: 0 }]}>Yine bekleriz, kahraman! ✨</Text>
            </View>
          </View>
        </Modal>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    paddingTop: 60, 
    paddingHorizontal: 20, 
    paddingBottom: 25,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 4
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  settingsBtn: { padding: 5 },
  profileInfo: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  avatarContainer: { position: 'relative' },
  avatar: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center' },
  avatarEmoji: { fontSize: 40 },
  editAvatarBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: 'white', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  userNameContainer: { flex: 1 },
  userName: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  levelBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  levelText: { fontSize: 12, fontWeight: 'bold' },
  levelProgressSection: { marginTop: 25 },
  levelLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  levelLabel: { fontSize: 11, fontWeight: '600' },
  progressBarBg: { height: 6, borderRadius: 3, width: '100%' },
  progressBarFill: { height: 6, borderRadius: 3 },
  statsGrid: { flexDirection: 'row', padding: 20, gap: 15 },
  statBox: { flex: 1, padding: 15, borderRadius: 20, alignItems: 'center', elevation: 2, position: 'relative', overflow: 'hidden' },
  statValue: { fontSize: 20, fontWeight: 'bold', zIndex: 1 },
  statLabel: { fontSize: 11, fontWeight: '500', marginTop: 4, zIndex: 1 },
  statEmoji: { position: 'absolute', bottom: -10, right: -10, fontSize: 40, opacity: 0.1 },
  section: { paddingLeft: 20, marginBottom: 25 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 20, marginBottom: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold' },
  seeAll: { fontSize: 13, fontWeight: '600' },
  badgesScroll: { paddingRight: 20 },
  badgeItem: { width: 90, padding: 12, borderRadius: 18, alignItems: 'center', marginRight: 12, elevation: 2 },
  badgeIcon: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  badgeName: { fontSize: 10, fontWeight: 'bold', textAlign: 'center' },
  certScroll: { paddingRight: 20 },
  certCard: { width: 160, padding: 15, borderRadius: 20, marginRight: 12, elevation: 2, flexDirection: 'row', alignItems: 'center', gap: 10 },
  certIcon: { width: 50, height: 50, borderRadius: 12, backgroundColor: '#FDFCF0', justifyContent: 'center', alignItems: 'center' },
  certInfo: { flex: 1 },
  certTitle: { fontSize: 13, fontWeight: 'bold' },
  certDate: { fontSize: 10, marginTop: 2 },
  addCertCard: { width: 100, height: 80, borderRadius: 20, borderStyle: 'dashed', borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  menuSection: { marginHorizontal: 20, borderRadius: 24, paddingVertical: 10, elevation: 2 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 18, gap: 15 },
  menuIcon: { fontSize: 22 },
  menuIconContainer: { width: 32, alignItems: 'center', justifyContent: 'center' },
  menuText: { flex: 1, fontSize: 15, fontWeight: '600' },
  menuArrow: { fontSize: 18 },
  menuDivider: { height: 1, backgroundColor: '#00000005', marginHorizontal: 18 },
  successRing: { width: 100, height: 100, borderRadius: 50, borderWidth: 8, justifyContent: 'center', alignItems: 'center' },
  successCircle: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
  themeSelector: {
    flexDirection: 'row',
    marginRight: 20,
    marginTop: 10,
    borderRadius: 15,
    padding: 5,
    gap: 5
  },
  themeOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  themeOptionText: {
    fontSize: 13,
    fontWeight: 'bold'
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', borderRadius: 32, padding: 25, alignItems: 'center', elevation: 10 },
  modalIconContainer: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  modalMessage: { fontSize: 16, textAlign: 'center', marginBottom: 25, lineHeight: 22 },
  modalActions: { flexDirection: 'row', gap: 10, width: '100%' },
  modalButton: { flex: 1, height: 54, borderRadius: 27, justifyContent: 'center', alignItems: 'center' },
  closeModal: { position: 'absolute', top: 20, right: 20, padding: 5, zIndex: 10 },
  themeMenuOption: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderRadius: 18, borderWidth: 1, marginBottom: 10 },
  themeMenuText: { fontSize: 16, fontWeight: '600' }
});