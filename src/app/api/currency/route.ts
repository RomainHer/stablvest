import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const amount = parseFloat(searchParams.get('amount') || '0');
  const fromCurrency = searchParams.get('from');
  const toCurrency = searchParams.get('to');

  if (!fromCurrency || !toCurrency) {
    return NextResponse.json({ error: 'From and to currencies are required' }, { status: 400 });
  }

  if (fromCurrency === toCurrency) {
    return NextResponse.json({ convertedAmount: amount });
  }

  try {
    const fxSymbol = `${fromCurrency.toUpperCase()}${toCurrency.toUpperCase()}=X`;
    const fxQuote = await yahooFinance.quote(fxSymbol);

    if (!fxQuote.regularMarketPrice) {
      return NextResponse.json(
        { error: `Conversion rate for ${fromCurrency} to ${toCurrency} not found` },
        { status: 404 }
      );
    }

    const convertedAmount = amount * fxQuote.regularMarketPrice;
    return NextResponse.json({ convertedAmount });
  } catch (error) {
    console.error('Error converting currency:', error);
    return NextResponse.json(
      { error: 'Failed to convert currency' },
      { status: 500 }
    );
  }
} 