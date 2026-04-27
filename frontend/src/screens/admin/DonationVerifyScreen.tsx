import React, { useState } from 'react';
import { Alert, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const pendingDonations = [
  { id: 1, productName: 'Okul Çantası', quantity: 50, region: 'Van', donorName: 'Ahmet Y.', status: 'pending' },
  { id: 2, productName: 'Battaniye', quantity: 100, region: 'Hatay', donorName: 'Mehmet D.', status: 'pending' },
];

export default function DonationVerifyScreen() {
  const { theme } = useTheme();
  const [proofNote, setProofNote] = useState('');

  const handleVerify = (donationId: number) => {
    Alert.alert(
      'Bağış Onaylandı',
      'Bu bağış teslim edildi olarak işaretlendi ve kullanıcıya kanıt gönderildi.',
      [{ text: 'Tamam' }]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={{ padding: 20, backgroundColor: theme.accent }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>Admin Panel</Text>
        <Text style={{ color: theme.accentLight }}>Bağışları Onayla ve Kanıt Ekle</Text>
      </View>

      <FlatList
        data={pendingDonations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ margin: 16, padding: 16, backgroundColor: theme.surface, borderRadius: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text1 }}>{item.productName}</Text>
            <Text style={{ color: theme.text3 }}>Adet: {item.quantity}</Text>
            <Text style={{ color: theme.text3 }}>Bölge: {item.region}</Text>
            <Text style={{ color: theme.text3 }}>Bağışçı: {item.donorName}</Text>

            <TextInput
              placeholder="Teslim notu (örn: Van Deprem Bölgesine ulaştırıldı)"
              placeholderTextColor={theme.text4}
              style={{ borderWidth: 1, borderColor: theme.border, borderRadius: 12, padding: 12, marginTop: 12, color: theme.text1 }}
              onChangeText={setProofNote}
            />

            <TouchableOpacity
              style={{ marginTop: 12, backgroundColor: theme.accent, padding: 12, borderRadius: 12, alignItems: 'center' }}
              onPress={() => handleVerify(item.id)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>✅ Bağışı Onayla ve Kanıt Gönder</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}