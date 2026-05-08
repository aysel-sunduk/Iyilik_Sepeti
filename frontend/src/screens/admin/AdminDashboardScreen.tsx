import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator, Platform } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { productService } from '../../services/product/productService';
import { campaignService } from '../../services/product/campaignService';

const AdminDashboardScreen = () => {
  const { theme, themeMode } = useTheme();
  const navigation = useNavigation<any>();
  const [stats, setStats] = useState({ products: 0, campaigns: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [])
  );

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const [products, campaigns] = await Promise.all([
        productService.getProducts(),
        campaignService.getAllCampaigns()
      ]);
      setStats({
        products: products.length,
        campaigns: campaigns.filter(c => c.isActive).length
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const menuItems = [
    {
      title: 'Ürün Yönetimi',
      description: 'Ürün ekle, düzenle veya sil',
      icon: '📦',
      screen: 'ProductManagement',
      color: '#4F46E5',
    },
    {
      title: 'Kampanya Yönetimi',
      description: 'Bağış kampanyalarını yönet',
      icon: '📢',
      screen: 'CampaignManagement',
      color: '#059669',
    },
    {
      title: 'Bağış Doğrulama',
      description: 'Gelen bağış kanıtlarını onayla',
      icon: '✅',
      screen: 'DonationVerify',
      color: '#D97706',
    },
    {
      title: 'Kategori Yönetimi',
      description: 'Ürün kategorilerini düzenle',
      icon: '📂',
      screen: 'CategoryManagement',
      color: '#7C3AED',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <Text style={[styles.headerTitle, { color: theme.text1 }]}>Admin Paneli</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
            {isLoading ? (
              <ActivityIndicator size="small" color={theme.accent} />
            ) : (
              <Text style={[styles.statValue, { color: theme.accent }]}>{stats.products}</Text>
            )}
            <Text style={[styles.statLabel, { color: theme.text3 }]}>Toplam Ürün</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#059669" />
            ) : (
              <Text style={[styles.statValue, { color: '#059669' }]}>{stats.campaigns}</Text>
            )}
            <Text style={[styles.statLabel, { color: theme.text3 }]}>Aktif Kampanya</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text1 }]}>Hızlı Erişim</Text>
        
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuCard, { backgroundColor: theme.surface }]}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
              </View>
              <Text style={[styles.menuTitle, { color: theme.text1 }]}>{item.title}</Text>
              <Text style={[styles.menuDescription, { color: theme.text4 }]}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: Platform.OS === 'android' ? 45 : 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    flex: 0.48,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuCard: {
    width: '48%',
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  menuIcon: {
    fontSize: 24,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  menuDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
});

export default AdminDashboardScreen;
