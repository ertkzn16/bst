// Root Layout - Tüm sayfaları saran ana düzen
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

// Google Fonts - Inter
const inter = Inter({ subsets: ['latin'] });

// SEO Metadata
export const metadata: Metadata = {
  title: 'BIST Borsa Analiz - Hisse Senedi Takip ve Teknik Analiz',
  description: 'Borsa İstanbul (BIST) hisse senetlerini takip edin, teknik analiz yapın ve grafik verilerini görselleştirin',
  keywords: ['BIST', 'Borsa', 'Hisse Senedi', 'Teknik Analiz', 'MA', 'RSI', 'MACD'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <Link href="/" className="hover:opacity-80 transition-opacity">
                  <h1 className="text-3xl font-bold">📈 BIST Borsa Analiz</h1>
                  <p className="text-blue-100 text-sm mt-1">
                    Hisse senedi takip ve teknik analiz platformu
                  </p>
                </Link>
              </div>
              <nav className="flex items-center gap-6">
                <Link
                  href="/"
                  className="text-white hover:text-blue-100 transition-colors font-medium"
                >
                  Ana Sayfa
                </Link>
                {/* Add more navigation links here as new pages are created */}
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-gray-400">
              © 2024 BIST Borsa Analiz - Eğitim Amaçlı Proje
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Veriler Yahoo Finance API&apos;den çekilmektedir. Yatırım tavsiyesi değildir.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
