import { Pacifico, Sawarabi_Mincho } from '@next/font/google';
import type { Metadata, Viewport } from 'next';
import './globals.scss';

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
});

const sawarabiMincho = Sawarabi_Mincho({
  weight: '400',
  subsets: ['latin'],
});

const APP_NAME = 'sushi-crush';
const APP_DEFAULT_TITLE = 'Sushi Crush';
const APP_DESCRIPTION = 'Sushi Crush Game';

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
  themeColor: '#d498a3',
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
      <body className={`${pacifico.className} ${sawarabiMincho.className}`}>
        {children}
      </body>
    </html>
  );
}
