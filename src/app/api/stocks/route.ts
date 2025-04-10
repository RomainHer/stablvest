import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const date = searchParams.get('date');

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
  }

  try {
    if (date) {
      const historical = await yahooFinance.historical(symbol, {
        period1: new Date(date),
        period2: new Date(date),
      });
      return NextResponse.json({ price: historical[0].close });
    } else {
      const quote = await yahooFinance.quote(symbol);
      return NextResponse.json({ price: quote.regularMarketPrice });
    }
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return NextResponse.json({ error: 'Failed to fetch stock data' }, { status: 500 });
  }
} 