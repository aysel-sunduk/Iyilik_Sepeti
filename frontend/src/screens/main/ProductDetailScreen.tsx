import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { productDetailStyles } from '../../styles/productDetailStyles';

export default function ProductDetailScreen({ route, navigation }: any) {
  const { theme } = useTheme();
  const { product } = route.params;
  const [selectedOption, setSelectedOption] = useState<'self' | 'donate'>('self');
  const [quantity, setQuantity] = useState(1);

  const handleBuy = () => {
    if (selectedOption === 'self') {
      navigation.navigate('Cart', { product, quantity, type: 'self' });
    } else {
      Alert.alert(
        'Bağış Yap',
        `${product.name} ürününden ${quantity} adet bağışlayacaksın. Bu ürün ihtiyaç sahibine ulaştırılacak.`,
        [
          { text: 'Vazgeç', style: 'cancel' },
          {
            text: 'Bağış Yap',
            onPress: () => navigation.navigate('DonationCheckout', { product, quantity })
          }
        ]
      );
    }
  };

  return (
    <View style={[productDetailStyles.container, { backgroundColor: theme.bg }]}>
      <View style={[productDetailStyles.imageContainer, { backgroundColor: theme.accentXl }]}>
        <Text style={productDetailStyles.productImage}>{product.image || '📦'}</Text>
      </View>

      <View style={[productDetailStyles.content, { backgroundColor: theme.surface }]}>
        <Text style={[productDetailStyles.productName, { color: theme.text1 }]}>{product.name}</Text>
        <Text style={[productDetailStyles.productPrice, { color: theme.accent }]}>₺{product.price?.toLocaleString() || 0}</Text>
        <Text style={[productDetailStyles.seller, { color: theme.text3 }]}>Satıcı: {product.seller || 'Heyva'}</Text>

        <View style={productDetailStyles.optionsRow}>
          <TouchableOpacity
            style={[
              productDetailStyles.optionButton,
              selectedOption === 'self' && { borderColor: theme.accent, backgroundColor: theme.accentLight }
            ]}
            onPress={() => setSelectedOption('self')}
          >
            <Text style={productDetailStyles.optionEmoji}>🛍️</Text>
            <Text style={[productDetailStyles.optionTitle, { color: theme.text1 }]}>Kendine Al</Text>
            <Text style={[productDetailStyles.optionDesc, { color: theme.text4 }]}>Ürün sana kargolansın</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              productDetailStyles.optionButton,
              selectedOption === 'donate' && { borderColor: theme.accent, backgroundColor: theme.accentLight }
            ]}
            onPress={() => setSelectedOption('donate')}
          >
            <Text style={productDetailStyles.optionEmoji}>🎁</Text>
            <Text style={[productDetailStyles.optionTitle, { color: theme.text1 }]}>Bağış Yap</Text>
            <Text style={[productDetailStyles.optionDesc, { color: theme.text4 }]}>İhtiyaç sahibine gönderilsin</Text>
          </TouchableOpacity>
        </View>

        <View style={productDetailStyles.quantityRow}>
          <Text style={[productDetailStyles.quantityLabel, { color: theme.text2 }]}>Adet:</Text>
          <View style={productDetailStyles.quantityControls}>
            <TouchableOpacity
              style={[productDetailStyles.quantityBtn, { borderColor: theme.border }]}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Text style={productDetailStyles.quantityBtnText}>-</Text>
            </TouchableOpacity>
            <Text style={[productDetailStyles.quantityValue, { color: theme.text1 }]}>{quantity}</Text>
            <TouchableOpacity
              style={[productDetailStyles.quantityBtn, { borderColor: theme.border }]}
              onPress={() => setQuantity(quantity + 1)}
            >
              <Text style={productDetailStyles.quantityBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={productDetailStyles.totalRow}>
          <Text style={[productDetailStyles.totalLabel, { color: theme.text2 }]}>Toplam:</Text>
          <Text style={[productDetailStyles.totalPrice, { color: theme.accent }]}>
            ₺{((product.price || 0) * quantity).toLocaleString()}
          </Text>
        </View>

        <TouchableOpacity
          style={[productDetailStyles.buyButton, { backgroundColor: theme.accent }]}
          onPress={handleBuy}
        >
          <Text style={productDetailStyles.buyButtonText}>
            {selectedOption === 'self' ? 'Sepete Ekle' : 'Bağış Yap →'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}