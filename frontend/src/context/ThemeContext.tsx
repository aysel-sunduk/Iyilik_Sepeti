import React, { createContext, useState, useContext, ReactNode } from 'react';
import { getTheme } from '../styles';

type Theme = ReturnType<typeof getTheme>;
type Mode = 'green' | 'trend';

interface ThemeContextType {
  theme: Theme;
  mode: Mode;
  setMode: (mode: Mode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<Mode>('green');
  const theme = getTheme(mode);

  return (
    <ThemeContext.Provider value={{ theme, mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};