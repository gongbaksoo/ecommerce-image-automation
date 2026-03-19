import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/ui/Navigation';
import ToastContainer from '@/components/ui/Toast';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '이커머스 행사 이미지 메이커',
  description: '쇼핑몰별 행사 이미지를 자동으로 생성하세요',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} font-sans antialiased bg-gray-50 min-h-screen`}>
        <Navigation />
        <main>{children}</main>
        <ToastContainer />
      </body>
    </html>
  );
}
