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
        {/* Header - Minimalist Design */}
        <header className="border-b border-gray-200 bg-white">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="group">
                <h1 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  Teknik Analiz
                </h1>
              </Link>
              <nav className="flex items-center gap-8">
                <Link
                  href="/"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Ana Sayfa
                </Link>
                <Link
                  href="/about"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Hakkında
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* Footer - Minimalist */}
        <footer className="border-t border-gray-200 py-8 mt-16">
          <div className="container mx-auto px-6 text-center">
            <p className="text-xs text-gray-500">
              © 2025 BIST Analiz - Eğitim amaçlı proje
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
