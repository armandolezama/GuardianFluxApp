// frontend/src/theme.ts
import { createTheme } from '@mui/material/styles';

// Colores de marca que podemos reutilizar directamente cuando los necesitemos
export const brandColors = {
  red: '#B41E24',
  gold: '#D4AF37',
};

// Tema claro (light)
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      // Azul de confianza
      main: '#2554A3',
      light: '#4F7AD1',
      dark: '#163569',
      contrastText: '#FFFFFF',
    },
    secondary: {
      // Dorado premium
      main: '#D4AF37',
      dark: '#A37F1F',
      light: '#F1D174',
      contrastText: '#1A1B1F',
    },
    background: {
      default: '#F7F7FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1B1F',
      secondary: '#4A4B52',
    },
    error: {
      main: '#D32F2F',
    },
    success: {
      main: '#2E7D32',
    },
    warning: {
      main: '#ED6C02',
    },
    info: {
      main: '#0288D1',
    },
    divider: '#E0E0E6',
  },
  shape: {
    borderRadius: 12,
  },
});

// Tema oscuro (dark)
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4F7AD1',
      dark: '#2554A3',
      light: '#7FA0FF',
      contrastText: '#0B0C10',
    },
    secondary: {
      main: '#D4AF37',
      dark: '#A37F1F',
      light: '#F1D174',
      contrastText: '#111217',
    },
    background: {
      default: '#05070A',
      paper: '#0D1117',
    },
    text: {
      primary: '#F5F6F8',
      secondary: '#B0B3C0',
    },
    error: {
      main: '#EF5350',
    },
    success: {
      main: '#4CAF50',
    },
    warning: {
      main: '#FFB74D',
    },
    info: {
      main: '#29B6F6',
    },
    divider: '#282C34',
  },
  shape: {
    borderRadius: 12,
  },
});
