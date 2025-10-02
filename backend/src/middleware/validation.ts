// backend/src/middleware/validation.ts
import { Request, Response, NextFunction } from 'express';

// Sanitize and validate wallet address
export const validateWalletAddress = (req: Request, res: Response, next: NextFunction) => {
  const address = req.params.address || req.body.wallet_address || req.query.address;
  
  if (address) {
    // Check if it's a valid Ethereum address (42 characters starting with 0x)
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!addressRegex.test(address)) {
      return res.status(400).json({ message: 'Invalid wallet address format' });
    }
  }
  
  next();
  return; // Added return to satisfy TS7030
};

// Validate IPFS hash
export const validateIPFSHash = (req: Request, res: Response, next: NextFunction) => {
  const hash = req.params.hash || req.body.hash;
  
  if (hash) {
    // Basic IPFS hash validation (multihash format)
    const ipfsHashRegex = /^[a-zA-Z0-9]{46,}$/; // Basic check, could be more specific
    if (!ipfsHashRegex.test(hash)) {
      return res.status(400).json({ message: 'Invalid IPFS hash format' });
    }
  }
  
  next();
  return; // Added return to satisfy TS7030
};

// Sanitize inputs to prevent injection attacks
export const sanitizeInputs = (req: Request, res: Response, next: NextFunction) => {
  // Sanitize body parameters
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        // Remove potentially dangerous characters
        req.body[key] = req.body[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        req.body[key] = req.body[key].replace(/javascript:/gi, '');
        req.body[key] = req.body[key].replace(/vbscript:/gi, '');
        req.body[key] = req.body[key].replace(/on\w+\s*=/gi, '');
      }
    }
  }
  
  // Sanitize query parameters
  if (req.query) {
    for (const key in req.query) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = req.query[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        req.query[key] = req.query[key].replace(/javascript:/gi, '');
        req.query[key] = req.query[key].replace(/vbscript:/gi, '');
        req.query[key] = req.query[key].replace(/on\w+\s*=/gi, '');
      }
    }
  }
  
  next();
  return; // Added return to satisfy TS7030
};

// Validate numeric inputs with min/max
export const validateNumericInput = (min: number = 0, max: number = Infinity) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check for amount fields
    if (req.body.amount !== undefined) {
      const amount = parseFloat(req.body.amount);
      if (isNaN(amount) || amount < min || amount > max) {
        return res.status(400).json({ message: `Amount must be between ${min} and ${max}` });
      }
    }
    
    // Check for other numeric fields
    if (req.body.fundingGoal !== undefined) {
      const goal = parseFloat(req.body.fundingGoal);
      if (isNaN(goal) || goal < min || goal > max) {
        return res.status(400).json({ message: `Funding goal must be between ${min} and ${max}` });
      }
    }
    
    next();
    return; // Added return to satisfy TS7030
  };
};