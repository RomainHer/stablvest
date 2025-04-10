const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

export class CryptoService {
  static async getCurrentPrice(symbol: string): Promise<number> {
    try {
      const response = await fetch(`${COINGECKO_API_URL}/simple/price?ids=${symbol}&vs_currencies=usd`);
      const data = await response.json();
      return data[symbol.toLowerCase()].usd;
    } catch (error) {
      console.error('Error fetching crypto price:', error);
      throw error;
    }
  }

  static async getHistoricalPrice(symbol: string, date: Date): Promise<number> {
    try {
      const timestamp = Math.floor(date.getTime() / 1000);
      const response = await fetch(
        `${COINGECKO_API_URL}/coins/${symbol}/market_chart/range?vs_currency=usd&from=${timestamp}&to=${timestamp}`
      );
      const data = await response.json();
      return data.prices[0][1];
    } catch (error) {
      console.error('Error fetching historical crypto price:', error);
      throw error;
    }
  }
} 