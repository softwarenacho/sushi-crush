import type { Metadata, Viewport } from 'next';
import './globals.scss';

const APP_NAME = 'pwa-next-template';
const APP_DEFAULT_TITLE = 'PWA Next.js template';
const APP_DESCRIPTION =
  'Next.js template with PWA integrated and scoring average 100';

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  manifest: '/manifest.json',
  keywords: ['next.js', 'template', 'ts', 'sass'],
  authors: [{ name: 'Nacho Betancourt' }],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_DEFAULT_TITLE,
    startupImage: '/icons/512x512.webp',
  },
};

export const viewport: Viewport = {
  themeColor: '#a6d6d8',
  minimumScale: 1,
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/icons/180x180.webp'
        />
        <link
          rel='icon'
          type='image/webp'
          sizes='32x32'
          href='/icons/32x32.webp'
        />
        <link
          rel='icon'
          type='image/webp'
          sizes='16x16'
          href='/icons/16x16.webp'
        />
        <meta name='view-transition' content='same-origin' />
      </head>
      <body>{children}</body>
    </html>
  );
}
