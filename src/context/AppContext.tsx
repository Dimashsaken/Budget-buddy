import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Transaction, Category, TransactionType } from '../types';
import { calculateBalance, generateId } from '../utils/helpers';
import { defaultCategories } from '../data/defaultCategories';

// State type
type AppState = {
  transactions: Transaction[];
  categories: Category[];
  isLoading: boolean;
  darkMode: boolean;
};

// Context type
type AppContextType = {
  state: AppState;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  toggleDarkMode: () => void;
};

// Action types
type Action =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'TOGGLE_DARK_MODE' };

// Initial state
const initialState: AppState = {
  transactions: [],
  categories: [],
  isLoading: true,
  darkMode: false,
};

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Reducer
const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
      };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter((c) => c.id !== action.payload),
      };
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload,
        isLoading: false,
      };
    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.payload,
        isLoading: false,
      };
    case 'TOGGLE_DARK_MODE':
      return {
        ...state,
        darkMode: !state.darkMode,
      };
    default:
      return state;
  }
};

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load data from localStorage on initial render
  useEffect(() => {
    const storedTransactions = localStorage.getItem('budgetbuddy_transactions');
    const storedCategories = localStorage.getItem('budgetbuddy_categories');
    const storedDarkMode = localStorage.getItem('budgetbuddy_darkMode');

    if (storedTransactions) {
      dispatch({
        type: 'SET_TRANSACTIONS',
        payload: JSON.parse(storedTransactions),
      });
    } else {
      dispatch({ type: 'SET_TRANSACTIONS', payload: [] });
    }

    if (storedCategories) {
      dispatch({
        type: 'SET_CATEGORIES',
        payload: JSON.parse(storedCategories),
      });
    } else {
      dispatch({ type: 'SET_CATEGORIES', payload: defaultCategories });
    }

    if (storedDarkMode) {
      if (JSON.parse(storedDarkMode)) {
        document.documentElement.classList.add('dark');
      }
      dispatch({
        type: 'TOGGLE_DARK_MODE',
      });
    }
  }, []);

  // Save data to localStorage when state changes
  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem(
        'budgetbuddy_transactions',
        JSON.stringify(state.transactions)
      );
      localStorage.setItem(
        'budgetbuddy_categories',
        JSON.stringify(state.categories)
      );
      localStorage.setItem(
        'budgetbuddy_darkMode',
        JSON.stringify(state.darkMode)
      );
    }
  }, [state.transactions, state.categories, state.darkMode, state.isLoading]);

  // Apply dark mode
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  // Context actions
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: generateId(),
    };
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
  };

  const updateTransaction = (transaction: Transaction) => {
    dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction });
  };

  const deleteTransaction = (id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: generateId(),
    };
    dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
  };

  const updateCategory = (category: Category) => {
    dispatch({ type: 'UPDATE_CATEGORY', payload: category });
  };

  const deleteCategory = (id: string) => {
    dispatch({ type: 'DELETE_CATEGORY', payload: id });
  };

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };

  const value = {
    state,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleDarkMode,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook for using the context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};