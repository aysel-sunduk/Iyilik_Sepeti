import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import { logout } from '../../redux/slices/authSlice';
import { RootState } from '../../redux/store';

export default function ProfileScreen({ navigation }: any) {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const donations = useSelector((state: RootState) => state.donation.donations);
  const totalDonated = useSelector((state: RootState) => state.donation.totalDonated);
  
  const deliveredDonations = donations.filter(d => d.status === 'delivered').length;
  const totalDonations = donations.length;

  const getBadge = () => {
    if (totalDonated >= 10000) return { name: '🌟 İyilik Elçisi', emoji: '🌟', color: '#F59E0B' };
    if (totalDonated >= 5000) return { name: '💚 İyilik Gönüllüsü', emoji: '💚', color: '#10B981' };
    if (totalDonated >= 1000) return { name: '🌱 İyilik Tohumu', emoji: '🌱', color: '#3B82F6' };
    return { name: '🪴 Yeni Fidan', emoji: '🪴', color: '#9CA3AF' };
  };

  const badge = getBadge();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { backgroundColor: theme.accent }]}>
        <Text style={styles.headerTitle}>👤 Profilim</Text>
      </View>

      <View style={[styles.profileCard, { backgroundColor: theme.surface }]}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>👤</Text>
        </View>
        <Text style={[styles.userName, { color: theme.text1 }]}>{user?.firstName || 'Misafir'} {user?.lastName || ''}</Text>
        <Text style={[styles.userEmail, { color: theme.text3 }]}>{user?.email || 'misafir@heyva.com'}</Text>
        
        <View style={[styles.badgeCard, { backgroundColor: badge.color + '20' }]}>
          <Text style={styles.badgeEmoji}>{badge.emoji}</Text>
          <Text style={[styles.badgeName, { color: badge.color }]}>{badge.name}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
          <Text style={styles.statEmoji}>🎁</Text>
          <Text style={[styles.statValue, { color: theme.text1 }]}>{totalDonations}</Text>
          <Text style={[styles.statLabel, { color: theme.text4 }]}>Toplam Bağış</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
          <Text style={styles.statEmoji}>✅</Text>
          <Text style={[styles.statValue, { color: theme.text1 }]}>{deliveredDonations}</Text>
          <Text style={[styles.statLabel, { color: theme.text4 }]}>Teslim Edilen</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
          <Text style={styles.statEmoji}>💰</Text>
          <Text style={[styles.statValue, { color: theme.accent }]}>₺{totalDonated.toLocaleString()}</Text>
          <Text style={[styles.statLabel, { color: theme.text4 }]}>Bağış Tutarı</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.surface }]} onPress={() => navigation.navigate('DonationTracking')}>
          <Text style={styles.menuEmoji}>🎁</Text>
          <Text style={[styles.menuText, { color: theme.text1 }]}>Bağışlarım</Text>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.surface }]} onPress={() => navigation.navigate('Categories')}>
          <Text style={styles.menuEmoji}>📂</Text>
          <Text style={[styles.menuText, { color: theme.text1 }]}>Kategoriler</Text>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: '#FEE2E2' }]} onPress={() => dispatch(logout())}>
          <Text style={styles.logoutText}>🚪 Çıkış Yap</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingBottom: 30, paddingHorizontal: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  profileCard: { margin: 20, padding: 20, borderRadius: 24, alignItems: 'center', marginTop: -20 },
  avatarContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatar: { fontSize: 40 },
  userName: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  userEmail: { fontSize: 14, marginBottom: 16 },
  badgeCard: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 30, gap: 8 },
  badgeEmoji: { fontSize: 20 },
  badgeName: { fontSize: 14, fontWeight: '600' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 20, marginBottom: 24 },
  statCard: { flex: 1, alignItems: 'center', padding: 12, borderRadius: 16, marginHorizontal: 4 },
  statEmoji: { fontSize: 28, marginBottom: 8 },
  statValue: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  statLabel: { fontSize: 11 },
  menuContainer: { marginHorizontal: 20, marginBottom: 40, gap: 12 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, gap: 12 },
  menuEmoji: { fontSize: 24 },
  menuText: { flex: 1, fontSize: 16, fontWeight: '500' },
  menuArrow: { fontSize: 18, color: '#9CA3AF' },
  logoutBtn: { padding: 16, borderRadius: 16, alignItems: 'center', marginTop: 8 },
  logoutText: { fontSize: 16, fontWeight: '600', color: '#DC2626' },
});