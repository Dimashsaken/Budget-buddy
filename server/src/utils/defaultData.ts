import Category from '../models/Category.js';

// Copy of frontend default categories with same structure
export const defaultCategories = [
  {
    id: 'category-income-salary',
    name: 'Salary',
    color: '#10B981',
    icon: 'briefcase',
    type: 'income',
  },
  {
    id: 'category-income-freelance',
    name: 'Freelance',
    color: '#3B82F6',
    icon: 'laptop',
    type: 'income',
  },
  {
    id: 'category-income-investments',
    name: 'Investments',
    color: '#8B5CF6',
    icon: 'trending-up',
    type: 'income',
  },
  {
    id: 'category-income-gifts',
    name: 'Gifts',
    color: '#EC4899',
    icon: 'gift',
    type: 'income',
  },
  {
    id: 'category-expense-food',
    name: 'Food & Dining',
    color: '#F97316',
    icon: 'utensils',
    type: 'expense',
  },
  {
    id: 'category-expense-transportation',
    name: 'Transportation',
    color: '#14B8A6',
    icon: 'car',
    type: 'expense',
  },
  {
    id: 'category-expense-housing',
    name: 'Housing & Rent',
    color: '#6366F1',
    icon: 'home',
    type: 'expense',
  },
  {
    id: 'category-expense-entertainment',
    name: 'Entertainment',
    color: '#F43F5E',
    icon: 'film',
    type: 'expense',
  },
  {
    id: 'category-expense-shopping',
    name: 'Shopping',
    color: '#EAB308',
    icon: 'shopping-bag',
    type: 'expense',
  },
  {
    id: 'category-expense-healthcare',
    name: 'Healthcare',
    color: '#06B6D4',
    icon: 'activity',
    type: 'expense',
  },
  {
    id: 'category-expense-utilities',
    name: 'Utilities',
    color: '#22C55E',
    icon: 'zap',
    type: 'expense',
  },
  {
    id: 'category-expense-education',
    name: 'Education',
    color: '#A855F7',
    icon: 'book',
    type: 'expense',
  },
];

// Initialize default categories if none exist
export const initializeDefaultCategories = async () => {
  try {
    const categoriesCount = await Category.countDocuments();
    
    if (categoriesCount === 0) {
      await Category.insertMany(defaultCategories);
      console.log('Default categories initialized');
    }
  } catch (error) {
    console.error('Error initializing default categories:', error);
  }
}; 