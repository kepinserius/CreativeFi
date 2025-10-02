// backend/src/routes/payments.ts
import express, { Request, Response } from 'express';
import { paymentService } from '../services/paymentService';

const router = express.Router();

// POST /api/onramp/quote - Get fiat to crypto quote
router.post('/onramp/quote', async (req: Request, res: Response) => {
  try {
    const { cryptoCurrencyCode, network, fiatCurrency, requestedAmount, walletAddress, email, redirectURL } = req.body;

    if (!cryptoCurrencyCode || !fiatCurrency || !requestedAmount || !walletAddress) {
      return res.status(400).json({ 
        message: 'Missing required fields: cryptoCurrencyCode, fiatCurrency, requestedAmount, walletAddress' 
      });
    }

    const quote = await paymentService.getFiatToCryptoQuote({
      cryptoCurrencyCode,
      network: network || 'ethereum',
      fiatCurrency,
      requestedAmount,
      walletAddress,
      email,
      redirectURL
    });

    if (!quote.success) {
      return res.status(500).json({ message: 'Error getting quote', error: quote.error });
    }

    res.json(quote);
  } catch (error) {
    console.error('Error getting onramp quote:', error);
    res.status(500).json({ message: 'Error getting onramp quote', error: (error as Error).message });
  }
  return; // Added return to satisfy TS7030
});

// POST /api/offramp/initiate - Initiate cashout crypto to fiat
router.post('/offramp/initiate', async (req: Request, res: Response) => {
  try {
    const { walletAddress, cryptoAmount, cryptoCurrency, receiveFiatAmount, receiveFiatCurrency } = req.body;

    if (!walletAddress || !cryptoAmount || !cryptoCurrency) {
      return res.status(400).json({ 
        message: 'Missing required fields: walletAddress, cryptoAmount, cryptoCurrency' 
      });
    }

    const result = await paymentService.initiateOffRamp(
      walletAddress,
      cryptoAmount,
      cryptoCurrency,
      receiveFiatAmount || 0,
      receiveFiatCurrency || 'USD'
    );

    if (!result.success) {
      return res.status(500).json({ message: 'Error initiating offramp', error: result.error });
    }

    res.json(result);
  } catch (error) {
    console.error('Error initiating offramp:', error);
    res.status(500).json({ message: 'Error initiating offramp', error: (error as Error).message });
  }
  return; // Added return to satisfy TS7030
});

export default router;