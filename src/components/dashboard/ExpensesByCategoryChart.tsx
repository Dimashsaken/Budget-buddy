import React, { useMemo } from 'react';
import { Transaction, Category } from '../../types';
import { formatCurrency } from '../../utils/helpers';

interface ExpensesByCategoryChartProps {
  transactions: Transaction[];
  categories: Category[];
}

interface CategoryExpense {
  categoryId: string;
  categoryName: string;
  color: string;
  amount: number;
  percentage: number;
}

const ExpensesByCategoryChart: React.FC<ExpensesByCategoryChartProps> = ({ 
  transactions, 
  categories 
}) => {
  // Get expenses by category
  const expensesByCategory = useMemo(() => {
    // Filter only expenses
    const expenses = transactions.filter(t => t.type === 'expense');
    
    // Calculate total expense amount
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    
    if (totalExpenses === 0) {
      return [];
    }
    
    // Group expenses by category
    const grouped: Record<string, number> = {};
    expenses.forEach(transaction => {
      if (grouped[transaction.category]) {
        grouped[transaction.category] += transaction.amount;
      } else {
        grouped[transaction.category] = transaction.amount;
      }
    });
    
    // Convert to array and calculate percentages
    const categoryExpenses: CategoryExpense[] = Object.entries(grouped)
      .map(([categoryId, amount]) => {
        const category = categories.find(c => c.id === categoryId);
        return {
          categoryId,
          categoryName: category?.name || 'Unknown',
          color: category?.color || '#CBD5E1',
          amount,
          percentage: (amount / totalExpenses) * 100
        };
      })
      .sort((a, b) => b.amount - a.amount);
    
    return categoryExpenses;
  }, [transactions, categories]);

  if (expensesByCategory.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6">Expenses by Category</h2>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No expense data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6">Expenses by Category</h2>
      
      {/* Chart bars */}
      <div className="space-y-4">
        {expensesByCategory.slice(0, 5).map((category) => (
          <div key={category.categoryId}>
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{category.categoryName}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{formatCurrency(category.amount)}</p>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="h-2.5 rounded-full" 
                style={{ 
                  width: `${category.percentage}%`,
                  backgroundColor: category.color 
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="mt-6 pt-4 border-t dark:border-gray-700">
        <div className="grid grid-cols-2 gap-2">
          {expensesByCategory.slice(0, 4).map((category) => (
            <div key={category.categoryId} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: category.color }}
              ></div>
              <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                {category.categoryName}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpensesByCategoryChart;