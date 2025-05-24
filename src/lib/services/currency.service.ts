export class CurrencyService {
  static async convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    try {
      const response = await fetch(
        `/api/currency?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to convert currency');
      }

      const data = await response.json();
      return data.convertedAmount;
    } catch (error) {
      console.error('Error converting currency:', error);
      throw error;
    }
  }
} 