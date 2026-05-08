import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator, SafeAreaView, Platform } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { campaignService } from '../../services/product/campaignService';
import { CampaignResponse } from '../../services/api/types';

const CampaignManagementScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const [campaigns, setCampaigns] = useState<CampaignResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadCampaigns();
    }, [])
  );

  const loadCampaigns = async () => {
    try {
      setIsLoading(true);
      const data = await campaignService.getAllCampaigns();
      setCampaigns(data);
    } catch (error) {
      console.error('Error loading campaigns:', error);
      Alert.alert('Hata', 'Kampanyalar yüklenirken bir sorun oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCampaign = (id: string, name: string) => {
    Alert.alert(
      'Kampanyayı Sil',
      `"${name}" kampanyasını silmek istediğinize emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Sil', 
          style: 'destructive',
          onPress: async () => {
            try {
              await campaignService.deleteCampaign(id);
              setCampaigns(prev => prev.filter(c => c.id !== id));
              Alert.alert('Başarılı', 'Kampanya başarıyla silindi.');
            } catch (error) {
              Alert.alert('Hata', 'Kampanya silinirken bir hata oluştu.');
            }
          }
        }
      ]
    );
  };

  const renderCampaignItem = ({ item }: { item: CampaignResponse }) => {
    const progress = item.targetAmount > 0 ? item.raisedAmount / item.targetAmount : 0;
    
    return (
      <View style={[styles.campaignCard, { backgroundColor: theme.surface }]}>
        <View style={[styles.campaignImage, { backgroundColor: theme.bg, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }]}>
          {item.imageUrl ? (
            <Image 
              source={{ uri: item.imageUrl }} 
              style={StyleSheet.absoluteFill} 
              resizeMode="cover"
            />
          ) : (
            <Text style={{ fontSize: 40 }}>{item.title.toLowerCase().includes('hayvan') ? '🐾' : '🎒'}</Text>
          )}
        </View>
        <View style={styles.campaignInfo}>
          <Text style={[styles.campaignTitle, { color: theme.text1 }]} numberOfLines={1}>{item.title}</Text>
          <Text style={[styles.campaignDescription, { color: theme.text4 }]} numberOfLines={2}>{item.description}</Text>
          
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
              <View style={[styles.progressFill, { width: `${Math.min(progress * 100, 100)}%`, backgroundColor: theme.accent }]} />
            </View>
            <View style={styles.progressTextRow}>
              <Text style={[styles.progressText, { color: theme.text3 }]}>{item.raisedAmount.toLocaleString('tr-TR')} TL toplandı</Text>
              <Text style={[styles.progressText, { color: theme.text3 }]}>{Math.round(progress * 100)}%</Text>
            </View>
          </View>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.accent + '20' }]}
            onPress={() => navigation.navigate('CampaignEdit', { campaign: item })}
          >
            <Text style={{ fontSize: 16 }}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#EF444420' }]}
            onPress={() => handleDeleteCampaign(item.id, item.title)}
          >
            <Text style={{ fontSize: 16 }}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text1 }]}>Kampanya Yönetimi</Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: theme.accent }]}
          onPress={() => navigation.navigate('CampaignEdit')}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      ) : (
        <FlatList
          data={campaigns}
          renderItem={renderCampaignItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={{ color: theme.text3 }}>Henüz kampanya bulunmuyor.</Text>
            </View>
          }
        />
      )}
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
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 45 : 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 20,
  },
  campaignCard: {
    borderRadius: 24,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  campaignImage: {
    width: '100%',
    height: 150,
    borderRadius: 18,
    marginBottom: 15,
  },
  campaignInfo: {
    flex: 1,
  },
  campaignTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
  },
  campaignDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 15,
  },
  progressContainer: {
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 11,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
});

export default CampaignManagementScreen;
