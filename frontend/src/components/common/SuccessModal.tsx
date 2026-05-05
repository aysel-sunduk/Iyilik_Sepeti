import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message: string;
}

export default function SuccessModal({ visible, onClose, title = 'Başarılı!', message }: SuccessModalProps) {
  const { theme } = useTheme();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.content, { backgroundColor: theme.surface }]}>
          {/* Üst Kısım: İkon ve Gradyan Efekti */}
          <View style={[styles.iconWrapper, { backgroundColor: '#10B98115' }]}>
             <View style={[styles.innerCircle, { backgroundColor: '#10B981' }]}>
                <Text style={styles.checkIcon}>✓</Text>
             </View>
          </View>

          <Text style={[styles.title, { color: theme.text1 }]}>{title}</Text>
          <Text style={[styles.message, { color: theme.text3 }]}>{message}</Text>
          
          <TouchableOpacity 
            activeOpacity={0.8}
            style={[styles.button, { backgroundColor: theme.accent }]} 
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Anladım</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  content: { 
    width: width * 0.85, 
    padding: 30, 
    borderRadius: 35, 
    alignItems: 'center', 
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  innerCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5
  },
  checkIcon: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold'
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 12,
    letterSpacing: 0.5
  },
  message: { 
    fontSize: 16, 
    textAlign: 'center', 
    marginBottom: 30, 
    lineHeight: 22,
    paddingHorizontal: 10
  },
  button: { 
    width: '100%', 
    height: 60, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 4
  },
  buttonText: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 18 
  }
});
