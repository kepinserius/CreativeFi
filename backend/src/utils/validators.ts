// backend/src/utils/validators.ts
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateCreateProject = (data: any): ValidationResult => {
  const errors: string[] = [];
  
  if (!data.title || data.title.trim().length < 5) {
    errors.push('Title is required and must be at least 5 characters long');
  }
  
  if (!data.description || data.description.trim().length < 20) {
    errors.push('Description is required and must be at least 20 characters long');
  }
  
  if (!data.category) {
    errors.push('Category is required');
  }
  
  if (!data.funding_goal || isNaN(data.funding_goal) || data.funding_goal <= 0) {
    errors.push('Valid funding goal is required');
  }
  
  if (!data.deadline || isNaN(new Date(data.deadline).getTime())) {
    errors.push('Valid deadline is required');
  }
  
  if (data.funding_goal && data.funding_goal < 0.1) { // Minimum 0.1 ETH
    errors.push('Funding goal must be at least 0.1 ETH or equivalent');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateInvestment = (data: any): ValidationResult => {
  const errors: string[] = [];
  
  if (!data.projectId || isNaN(data.projectId)) {
    errors.push('Valid project ID is required');
  }
  
  if (!data.amount || isNaN(data.amount) || data.amount <= 0) {
    errors.push('Valid investment amount is required');
  }
  
  if (!data.token || !['ETH', 'USDC', 'USDT'].includes(data.token)) {
    errors.push('Valid token (ETH, USDC, or USDT) is required');
  }
  
  if (data.amount < 0.001) { // Minimum investment
    errors.push('Investment amount must be at least 0.001');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateUserRegistration = (data: any): ValidationResult => {
  const errors: string[] = [];
  
  if (!data.wallet_address) {
    errors.push('Wallet address is required');
  } else if (!/^0x[a-fA-F0-9]{40}$/.test(data.wallet_address)) {
    errors.push('Invalid wallet address format');
  }
  
  if (data.username && data.username.length > 50) {
    errors.push('Username must be less than 50 characters');
  }
  
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format');
  }
  
  if (data.role && !['creator', 'investor'].includes(data.role)) {
    errors.push('Role must be either "creator" or "investor"');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateMilestone = (data: any): ValidationResult => {
  const errors: string[] = [];
  
  if (!data.title || data.title.trim().length < 3) {
    errors.push('Title is required and must be at least 3 characters long');
  }
  
  if (!data.description || data.description.trim().length < 10) {
    errors.push('Description is required and must be at least 10 characters long');
  }
  
  if (!data.amount || isNaN(data.amount) || data.amount <= 0) {
    errors.push('Valid amount is required');
  }
  
  if (!data.deadline || isNaN(new Date(data.deadline).getTime())) {
    errors.push('Valid deadline is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};