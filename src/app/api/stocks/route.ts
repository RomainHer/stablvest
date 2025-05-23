import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const date = searchParams.get('date');
  const currency = searchParams.get('currency'); // ex: EUR

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
  }

  try {
    let price: number;

    if (date) {
      const historical = await yahooFinance.historical(symbol, {
        period1: new Date(date),
        period2: new Date(date),
      });
      price = historical[0]?.close ?? 0;
    } else {
      const quote = await yahooFinance.quote(symbol);
      price = quote.regularMarketPrice ?? 0;
    }

    let convertedPrice = price;

    if (currency && currency.toUpperCase() !== 'USD') {
      const fxSymbol = `${currency.toUpperCase()}USD=X`;
      const fxQuote = await yahooFinance.quote(fxSymbol);

      if (!fxQuote.regularMarketPrice) {
        throw new Error(`Conversion rate for ${currency} not found`);
      }

      convertedPrice = price / fxQuote.regularMarketPrice;
    }

    return NextResponse.json({ price: convertedPrice });

  } catch (error) {
    console.error('Error fetching stock data:', error);
    return NextResponse.json({ error: 'Failed to fetch stock data' }, { status: 500 });
  }
}
