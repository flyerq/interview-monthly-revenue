import './globals.css';
import {AppRouterCacheProvider} from '@mui/material-nextjs/v15-appRouter';
import type {Metadata} from 'next';
import {theme} from '@/theme/theme';
import {CssBaseline, ThemeProvider} from '@mui/material';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: '每月營收查詢',
  description: '每月營收查詢',
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="zh-TW">
      <body>
        <AppRouterCacheProvider>
          <Providers>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {children}
            </ThemeProvider>
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
