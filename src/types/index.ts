export type TransactionType = 'income' | 'expense';

export type Category = {
  id: string;
  name: string;
  color: string;
  icon: string;
  type: TransactionType;
};

export type Transaction = {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: TransactionType;
};

export type Balance = {
  total: number;
  income: number;
  expense: number;
};