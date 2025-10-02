// backend/src/utils/helpers.ts
import crypto from 'crypto';

export const generateId = (length: number = 16): string => {
  return crypto.randomBytes(length).toString('hex');
};

export const validateWalletAddress = (address: string): boolean => {
  // Basic Ethereum address validation (42 characters starting with 0x)
  const addressRegex = /^0x[a-fA-F0-9]{40}$/;
  return addressRegex.test(address);
};

export const validateIPFSHash = (hash: string): boolean => {
  // Basic IPFS hash validation (multihash format)
  const ipfsHashRegex = /^[a-zA-Z0-9]{46,}$/;
  return ipfsHashRegex.test(hash);
};

export const sanitizeInput = (input: string): string => {
  // Remove potentially dangerous characters
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

export const calculatePercentage = (part: number, whole: number): number => {
  if (whole === 0) return 0;
  return Math.round((part / whole) * 100);
};

export const generateTokenAmount = (investmentAmount: number, fundingGoal: number, totalSupply: number = 1000000): number => {
  if (fundingGoal === 0) return 0;
  return (investmentAmount / fundingGoal) * totalSupply;
};