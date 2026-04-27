// src/styles/donationTrackingStyles.ts (mevcut stillerinize EKLEYİN)
import { StyleSheet } from 'react-native';

export const donationTrackingStyles = StyleSheet.create({
  // ... mevcut stilleriniz ...
  
  // YENİ EKLENECEK STILLER:
  friendBadge: {
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 8,
  },
  friendText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  messageText: {
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  cardNameText: {
    fontSize: 12,
    textAlign: 'right',
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