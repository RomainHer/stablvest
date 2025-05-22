const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  market_cap: number;
}

export class CryptoService {
  private static readonly COINGECKO_API = 'https://api.coingecko.com/api/v3';

  static async getCurrentPrice(id: string): Promise<number> {
    try {
      const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
      if (!apiKey) {
        throw new Error('CoinGecko API key is not defined');
      }
      const response = await fetch(`${COINGECKO_API_URL}/simple/price?ids=${id}&vs_currencies=usd`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'x-cg-demo-api-key': apiKey,
        },
      });
      const data = await response.json();
      console.log(data)
      return data[id.toLowerCase()].usd;
    } catch (error) {
      console.error('Error fetching crypto price:', error);
      throw error;
    }
  }

  static async getHistoricalPrice(id: string, date: Date): Promise<number> {
    try {
      const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
      if (!apiKey) {
        throw new Error('CoinGecko API key is not defined');
      }
      const timestamp = Math.floor(date.getTime() / 1000);
      const response = await fetch(
        `${COINGECKO_API_URL}/coins/${id}/market_chart/range?vs_currency=usd&from=${timestamp}&to=${timestamp}`,
        {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'x-cg-demo-api-key': apiKey,
          },
        }
      );
      const data = await response.json();
      return data.prices[0][1];
    } catch (error) {
      console.error('Error fetching historical crypto price:', error);
      throw error;
    }
  }

  static async getCryptoList(): Promise<{ id: string; symbol: string; name: string }[]> {
    try {
      const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
      if (!apiKey) {
        throw new Error('CoinGecko API key is not defined');
      }

      // Récupérer les top 20 cryptos par market cap
      const response = await fetch(`${this.COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1`, {
        headers: {
          'Accept': 'application/json',
          'x-cg-demo-api-key': apiKey,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch crypto list');
      }

      const data = await response.json();
      return data.map((coin: CoinMarketData) => ({
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name
      }));
    } catch (error) {
      console.error('Error fetching crypto list:', error);
      // Retourner une liste de cryptos populaires en cas d'erreur
      return [
        { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin' },
        { id: 'ethereum', symbol: 'eth', name: 'Ethereum' },
        { id: 'binancecoin', symbol: 'bnb', name: 'Binance Coin' },
        { id: 'ripple', symbol: 'xrp', name: 'XRP' },
        { id: 'cardano', symbol: 'ada', name: 'Cardano' },
        { id: 'solana', symbol: 'sol', name: 'Solana' },
        { id: 'polkadot', symbol: 'dot', name: 'Polkadot' },
        { id: 'dogecoin', symbol: 'doge', name: 'Dogecoin' },
        { id: 'avalanche-2', symbol: 'avax', name: 'Avalanche' },
        { id: 'polygon', symbol: 'matic', name: 'Polygon' }
      ];
    }
  }
} 