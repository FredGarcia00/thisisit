import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/hooks/use-auth';
import { Toaster } from '@/components/ui/sonner';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ViralReel Studio - AI Video Creation Platform',
  description: 'Create viral short-form videos with AI avatars, automated scripts, and professional templates.',
  keywords: 'AI video creation, TikTok videos, AI avatars, content creation, viral videos',
  authors: [{ name: 'ViralReel Studio' }],
  creator: 'ViralReel Studio',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'ViralReel Studio - AI Video Creation Platform',
    description: 'Create viral short-form videos with AI avatars, automated scripts, and professional templates.',
    siteName: 'ViralReel Studio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ViralReel Studio - AI Video Creation Platform',
    description: 'Create viral short-form videos with AI avatars, automated scripts, and professional templates.',
    creator: '@viralreelstudio',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {children}
            <Toaster />
            <Analytics />
            <SpeedInsights />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}