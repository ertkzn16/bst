// API Route - Yahoo Finance verilerini server-side'da çeker
import { NextRequest, NextResponse } from 'next/server';
import { fetchStockData, fetchMultipleStocks } from '@/app/lib/fetchStockData';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol');
    const symbols = searchParams.get('symbols');
    const period = (searchParams.get('period') || '2y') as '1mo' | '3mo' | '6mo' | '1y' | '2y' | '5y';

    // Tek hisse mi, çoklu hisse mi?
    if (symbols) {
      // Çoklu hisse
      const symbolArray = symbols.split(',');
      const data = await fetchMultipleStocks(symbolArray, period);
      return NextResponse.json(data);
    } else if (symbol) {
      // Tek hisse
      const data = await fetchStockData(symbol, period);
      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        { error: 'Symbol veya symbols parametresi gerekli' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Veri çekilemedi' },
      { status: 500 }
    );
  }
}
