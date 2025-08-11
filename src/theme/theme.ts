'use client';
import {createTheme} from '@mui/material/styles';

export const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: '#0386f4',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff5983',
      dark: '#9a0036',
      contrastText: '#fff',
    },
    background: {
      default: '#ededed',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#434343',
    },
  },
  typography: {
    fontFamily: '"PingFang TC", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
});
