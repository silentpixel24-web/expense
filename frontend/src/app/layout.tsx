import type { Metadata } from 'next';
import { Inter, Amiri } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const amiri = Amiri({ weight: ['400', '700'], subsets: ['arabic', 'latin'], variable: '--font-amiri' });

const mosqueName = process.env.NEXT_PUBLIC_MOSQUE_NAME || 'Mosque Finance';

export const metadata: Metadata = {
  title: `${mosqueName} | Transparent Financial Management`,
  description: `${mosqueName} — expenditure and financial transparency management`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${amiri.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
