import { Category, Transaction, TransactionType, Balance } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

// Format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

// Generate unique ID
export const generateId = (): string => {
  return uuidv4();
};

// Calculate balance from transactions
export const calculateBalance = (transactions: Transaction[]): Balance => {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  return {
    total: income - expense,
    income,
    expense,
  };
};

// Get transaction display properties based on type
export const getTransactionTypeProperties = (type: TransactionType) => {
  return {
    income: {
      label: 'Income',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      sign: '+',
    },
    expense: {
      label: 'Expense',
      textColor: 'text-rose-600',
      bgColor: 'bg-rose-100',
      sign: '-',
    }
  }[type];
};

// Filter transactions
export const filterTransactions = (
  transactions: Transaction[],
  filters: {
    type?: TransactionType | 'all';
    category?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }
): Transaction[] => {
  return transactions.filter((transaction) => {
    // Filter by type
    if (filters.type && filters.type !== 'all' && transaction.type !== filters.type) {
      return false;
    }
    
    // Filter by category
    if (filters.category && transaction.category !== filters.category) {
      return false;
    }
    
    // Filter by date range
    if (filters.startDate && new Date(transaction.date) < new Date(filters.startDate)) {
      return false;
    }
    
    if (filters.endDate && new Date(transaction.date) > new Date(filters.endDate)) {
      return false;
    }
    
    // Filter by search term
    if (
      filters.search &&
      !transaction.description.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }
    
    return true;
  });
};