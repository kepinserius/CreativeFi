// backend/src/services/paymentService.ts
import axios from 'axios';

interface TransakConfig {
  apiKey: string;
  environment: 'STAGING' | 'PRODUCTION';
}

interface QuoteRequest {
  cryptoCurrencyCode: string;
  network: string;
  fiatCurrency: string;
  requestedAmount: number;
  walletAddress: string;
  email?: string;
  redirectURL?: string;
}

interface QuoteResponse {
  success: boolean;
  data?: {
    url: string;
    orderId: string;
  };
  error?: string;
}

export class PaymentService {
  private config: TransakConfig;
  
  constructor() {
    this.config = {
      apiKey: process.env.TRANSAK_API_KEY || '',
      environment: (process.env.TRANSAK_ENV as 'STAGING' | 'PRODUCTION') || 'STAGING'
    };
  }
  
  async getFiatToCryptoQuote(request: QuoteRequest): Promise<QuoteResponse> {
    try {
      if (!this.config.apiKey) {
        throw new Error('Transak API key not configured');
      }
      
      // Prepare the Transak widget URL with the parameters
      const environment = this.config.environment.toLowerCase();
      const transakUrl = `https://${environment}.transak.com`;
      
      // In a real implementation, we would call Transak's API to get a quote
      // For this implementation, we'll return the URL to initialize the widget
      const queryParams = new URLSearchParams({
        apiKey: this.config.apiKey,
        cryptoCurrencyCode: request.cryptoCurrencyCode,
        networks: request.network,
        fiatCurrency: request.fiatCurrency,
        defaultFiatAmount: request.requestedAmount.toString(),
        walletAddress: request.walletAddress,
        isAutoFill: 'true',
        hideMenu: 'true',
        exchangeScreenTitle: 'Fund Your Wallet',
        themeColor: '#6d28d9', // Purple theme to match our app
        ...request.email && { email: request.email },
        ...request.redirectURL && { redirectURL: request.redirectURL }
      });
      
      return {
        success: true,
        data: {
          url: `${transakUrl}?${queryParams.toString()}`,
          orderId: `ORDER_${Date.now()}`
        }
      };
    } catch (error) {
      console.error('Error getting Transak quote:', error);
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }
  
  // Simulate initiating a crypto-to-fiat off-ramp transaction
  async initiateOffRamp(
    walletAddress: string,
    cryptoAmount: number,
    cryptoCurrency: string,
    receiveFiatAmount: number,
    receiveFiatCurrency: string
  ): Promise<QuoteResponse> {
    try {
      // In a real implementation, this would integrate with a crypto-to-fiat service
      // For now, return a mock response
      return {
        success: true,
        data: {
          url: `https://offramp.example.com?wallet=${walletAddress}&amount=${cryptoAmount}&currency=${cryptoCurrency}`,
          orderId: `OFFRAMP_${Date.now()}`
        }
      };
    } catch (error) {
      console.error('Error initiating off-ramp:', error);
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }
}

export const paymentService = new PaymentService();