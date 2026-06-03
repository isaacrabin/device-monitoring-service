import type { Metadata } from 'next';
import { Maven_Pro } from 'next/font/google';
import { AuthProvider } from '@/app/contexts/AuthContext';
import './globals.css';

const mavenPro = Maven_Pro({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-maven-pro',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Network Device Monitor',
  description: 'Enterprise network device monitoring platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${mavenPro.variable} custom-scrollbar`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}