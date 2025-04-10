export class StockService {
  static async getCurrentPrice(symbol: string): Promise<number> {
    try {
      const response = await fetch(`/api/stocks?symbol=${symbol}`);
      if (!response.ok) {
        throw new Error('Failed to fetch stock price');
      }
      const data = await response.json();
      return data.price;
    } catch (error) {
      console.error('Error fetching stock price:', error);
      throw error;
    }
  }

  static async getHistoricalPrice(symbol: string, date: Date): Promise<number> {
    try {
      const response = await fetch(`/api/stocks?symbol=${symbol}&date=${date.toISOString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch historical stock price');
      }
      const data = await response.json();
      return data.price;
    } catch (error) {
      console.error('Error fetching historical stock price:', error);
      throw error;
    }
  }
} 