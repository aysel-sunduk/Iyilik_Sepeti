import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  iyilikBalance?: number;
  walletBalance?: number;
}

interface AuthState {
  user: User | null;
  mode: 'green' | 'trend';
  loading: boolean;
  error: string | null;
  treeProgress: number;
  justLoggedIn: boolean;
}

const initialState: AuthState = {
  user: null,
  mode: 'green',
  loading: false,
  error: null,
  treeProgress: 0,
  justLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<'green' | 'trend'>) => {
      state.mode = action.payload;
    },
    setTreeProgress: (state, action: PayloadAction<number>) => {
      state.treeProgress = action.payload;
    },
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
      state.justLoggedIn = true;
    },
    resetLoggedIn: (state) => {
      state.justLoggedIn = false;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const {
  setMode,
  setTreeProgress,
  registerStart,
  registerSuccess,
  registerFailure,
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  resetLoggedIn,
} = authSlice.actions;

export default authSlice.reducer;