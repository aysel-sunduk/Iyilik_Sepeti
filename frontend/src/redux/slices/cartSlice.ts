import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api/api';

export interface CartItem {
  id: number | string;
  name: string;
  price: number;
  image: string;
  seller: string;
  quantity: number;
  type: 'self' | 'donation';
  donorName?: string;
  message?: string;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  loading: boolean;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  loading: false,
};

// Async Thunk to fetch cart from backend
export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const data = await api.cart.get();
  return data.map((item: any) => ({
    id: item.productId,
    name: item.name,
    price: item.price,
    image: item.imageUrl,
    seller: 'İyilik Sepeti', // Default
    quantity: item.quantity,
    type: item.type,
  }));
});

// Async Thunk to sync item change with backend
export const syncCartItem = createAsyncThunk(
  'cart/syncItem',
  async (item: { id: string | number; quantity: number; type: string }) => {
    if (item.quantity > 0) {
      await api.cart.update({
        productId: item.id.toString(),
        quantity: item.quantity,
        type: item.type
      });
    } else {
      await api.cart.remove(item.id.toString(), item.type);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        item => item.id === action.payload.id && item.type === action.payload.type
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.totalAmount = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    removeFromCart: (state, action: PayloadAction<{ id: number | string; type: 'self' | 'donation' }>) => {
      state.items = state.items.filter(
        item => !(item.id === action.payload.id && item.type === action.payload.type)
      );
      state.totalAmount = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    updateQuantity: (state, action: PayloadAction<{ id: number | string; type: 'self' | 'donation'; quantity: number }>) => {
      const item = state.items.find(
        i => i.id === action.payload.id && i.type === action.payload.type
      );
      if (item) {
        item.quantity = action.payload.quantity;
        state.totalAmount = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.totalAmount = action.payload.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      })
      .addCase(fetchCart.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;