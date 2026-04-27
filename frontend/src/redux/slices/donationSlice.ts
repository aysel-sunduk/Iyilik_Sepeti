// src/redux/slices/donationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Donation {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  date: string;
  status: 'pending' | 'shipping' | 'delivered';
  donationType: 'anonymous' | 'friend';
  friendName?: string;
  message?: string;
  cardName?: string;
  proofImage?: string;
  deliveryNote?: string;
  beneficiary?: string;
}

interface DonationState {
  donations: Donation[];
  totalDonated: number;
}

const initialState: DonationState = {
  donations: [],
  totalDonated: 0,
};

const donationSlice = createSlice({
  name: 'donation',
  initialState,
  reducers: {
    addDonation: (state, action: PayloadAction<Donation>) => {
      state.donations.unshift(action.payload);
      state.totalDonated += action.payload.price * action.payload.quantity;
    },
    updateDonationStatus: (state, action: PayloadAction<{ id: string; status: Donation['status']; proofImage?: string; deliveryNote?: string; beneficiary?: string }>) => {
      const donation = state.donations.find(d => d.id === action.payload.id);
      if (donation) {
        donation.status = action.payload.status;
        if (action.payload.proofImage) donation.proofImage = action.payload.proofImage;
        if (action.payload.deliveryNote) donation.deliveryNote = action.payload.deliveryNote;
        if (action.payload.beneficiary) donation.beneficiary = action.payload.beneficiary;
      }
    },
  },
});

export const { addDonation, updateDonationStatus } = donationSlice.actions;
export default donationSlice.reducer;