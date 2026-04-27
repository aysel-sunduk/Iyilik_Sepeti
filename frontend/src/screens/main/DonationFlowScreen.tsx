import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export default function DonationFlowScreen({ route, navigation }: any) {
  const { theme } = useTheme();
  const { product } = route.params;
  
  const [quantity, setQuantity] = useState(1);
  const [donationType, setDonationType] = useState<'anonymous' | 'friend'>('anonymous');
  const [friendName, setFriendName] = useState('');
  const [message, setMessage] = useState('');
  const [cardName, setCardName] = useState('');

  const handleDonate = () => {
    if (donationType === 'friend' && !friendName.trim()) {
      Alert.alert('Uyarı', 'Lütfen arkadaşınızın adını girin');
      return;
    }

    const donationData = {
      product: product,
      quantity: quantity,
      donationType: donationType,
      friendName: donationType === 'friend' ? friendName : null,
      message: message || null,
      cardName: cardName || null,
      date: new Date().toISOString(),
      status: 'pending',
    };

    console.log('Bağış verisi:', donationData);

    Alert.alert(
      'Bağışınız Alındı! 🙏',
      donationType === 'friend' 
        ? `${friendName} adına yaptığınız bağış işleme alındı. Teşekkür ederiz!`
        : 'Bağışınız için teşekkür ederiz! İhtiyaç sahibine ulaştırılacak.',
      [
        {
          text: 'Tamam',
          onPress: () => navigation.navigate('DonationTracking')
        }
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.productCard, { backgroundColor: theme.surface }]}>
        <Text style={styles.productEmoji}>{product.image || '🎁'}</Text>
        <View style={styles.productInfo}>
          <Text style={[styles.productName, { color: theme.text1 }]}>{product.name}</Text>
          <Text style={[styles.productPrice, { color: theme.accent }]}>
            {product.price ? `₺${product.price}` : 'Bağış Ürünü'}
          </Text>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Text style={[styles.cardTitle, { color: theme.text1 }]}>Adet</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={[styles.quantityBtn, { borderColor: theme.border }]}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Text style={styles.quantityBtnText}>-</Text>
          </TouchableOpacity>
          <Text style={[styles.quantityText, { color: theme.text1 }]}>{quantity}</Text>
          <TouchableOpacity
            style={[styles.quantityBtn, { borderColor: theme.border }]}
            onPress={() => setQuantity(quantity + 1)}
          >
            <Text style={styles.quantityBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Text style={[styles.cardTitle, { color: theme.text1 }]}>Bağış Tipi</Text>
        
        <TouchableOpacity
          style={[
            styles.typeOption,
            donationType === 'anonymous' && { borderColor: theme.accent, backgroundColor: theme.accentLight }
          ]}
          onPress={() => setDonationType('anonymous')}
        >
          <Text style={styles.typeEmoji}>🌍</Text>
          <View style={styles.typeTextContainer}>
            <Text style={[styles.typeTitle, { color: theme.text1 }]}>Anonim Bağış</Text>
            <Text style={[styles.typeDesc, { color: theme.text4 }]}>İhtiyaç sahibine doğrudan ulaşsın</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeOption,
            donationType === 'friend' && { borderColor: theme.accent, backgroundColor: theme.accentLight }
          ]}
          onPress={() => setDonationType('friend')}
        >
          <Text style={styles.typeEmoji}>👫</Text>
          <View style={styles.typeTextContainer}>
            <Text style={[styles.typeTitle, { color: theme.text1 }]}>Arkadaşıma Hediye</Text>
            <Text style={[styles.typeDesc, { color: theme.text4 }]}>Arkadaşın adına bağış yap, kart gönder</Text>
          </View>
        </TouchableOpacity>
      </View>

      {donationType === 'friend' && (
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.text1 }]}>Arkadaşının Adı</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.bg, borderColor: theme.border, color: theme.text1 }]}
            placeholder="Örn: Ayşe Yılmaz"
            placeholderTextColor={theme.text4}
            value={friendName}
            onChangeText={setFriendName}
          />

          <Text style={[styles.cardTitle, { color: theme.text1, marginTop: 16 }]}>Kart / Mesaj (isteğe bağlı)</Text>
          <TextInput
            style={[styles.textArea, { backgroundColor: theme.bg, borderColor: theme.border, color: theme.text1 }]}
            placeholder="Doğum günün kutlu olsun! Senin adına bir iyilik yaptım 🌱"
            placeholderTextColor={theme.text4}
            multiline
            numberOfLines={4}
            value={message}
            onChangeText={setMessage}
          />

          <Text style={[styles.cardTitle, { color: theme.text1, marginTop: 16 }]}>Kart İmzası (isteğe bağlı)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.bg, borderColor: theme.border, color: theme.text1 }]}
            placeholder="Sevgiler, [Adınız]"
            placeholderTextColor={theme.text4}
            value={cardName}
            onChangeText={setCardName}
          />
        </View>
      )}

      <TouchableOpacity
        style={[styles.donateButton, { backgroundColor: theme.accent }]}
        onPress={handleDonate}
      >
        <Text style={styles.donateButtonText}>🎁 {quantity} Adet Bağış Yap</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  productEmoji: {
    fontSize: 48,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  quantityBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityBtnText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 20,
    fontWeight: 'bold',
    minWidth: 50,
    textAlign: 'center',
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  typeEmoji: {
    fontSize: 28,
    marginRight: 14,
  },
  typeTextContainer: {
    flex: 1,
  },
  typeTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  typeDesc: {
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  donateButton: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 8,
  },
  donateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});