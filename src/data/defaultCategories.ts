import { Category } from '../types';

export const defaultCategories: Category[] = [
  {
    id: 'category-income-salary',
    name: 'Salary',
    color: '#10B981', // emerald-500
    icon: 'briefcase',
    type: 'income',
  },
  {
    id: 'category-income-freelance',
    name: 'Freelance',
    color: '#3B82F6', // blue-500
    icon: 'laptop',
    type: 'income',
  },
  {
    id: 'category-income-investments',
    name: 'Investments',
    color: '#8B5CF6', // violet-500
    icon: 'trending-up',
    type: 'income',
  },
  {
    id: 'category-income-gifts',
    name: 'Gifts',
    color: '#EC4899', // pink-500
    icon: 'gift',
    type: 'income',
  },
  {
    id: 'category-expense-food',
    name: 'Food & Dining',
    color: '#F97316', // orange-500
    icon: 'utensils',
    type: 'expense',
  },
  {
    id: 'category-expense-transportation',
    name: 'Transportation',
    color: '#14B8A6', // teal-500
    icon: 'car',
    type: 'expense',
  },
  {
    id: 'category-expense-housing',
    name: 'Housing & Rent',
    color: '#6366F1', // indigo-500
    icon: 'home',
    type: 'expense',
  },
  {
    id: 'category-expense-entertainment',
    name: 'Entertainment',
    color: '#F43F5E', // rose-500
    icon: 'film',
    type: 'expense',
  },
  {
    id: 'category-expense-shopping',
    name: 'Shopping',
    color: '#EAB308', // yellow-500
    icon: 'shopping-bag',
    type: 'expense',
  },
  {
    id: 'category-expense-healthcare',
    name: 'Healthcare',
    color: '#06B6D4', // cyan-500
    icon: 'activity',
    type: 'expense',
  },
  {
    id: 'category-expense-utilities',
    name: 'Utilities',
    color: '#22C55E', // green-500
    icon: 'zap',
    type: 'expense',
  },
  {
    id: 'category-expense-education',
    name: 'Education',
    color: '#A855F7', // purple-500
    icon: 'book',
    type: 'expense',
  },
];