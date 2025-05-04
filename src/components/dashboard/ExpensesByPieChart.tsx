import React, { useMemo } from 'react';
import { Transaction, Category } from '../../types';
import { formatCurrency } from '../../utils/helpers';

interface ExpensesByPieChartProps {
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

const ExpensesByPieChart: React.FC<ExpensesByPieChartProps> = ({ 
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

  // Calculate the values needed for the pie chart
  const pieChartData = useMemo(() => {
    let cumulativePercentage = 0;
    
    return expensesByCategory.map(category => {
      const startAngle = cumulativePercentage;
      cumulativePercentage += category.percentage;
      const endAngle = cumulativePercentage;
      
      return {
        ...category,
        startAngle,
        endAngle
      };
    });
  }, [expensesByCategory]);

  // Function to calculate the SVG path for a pie slice
  const getSlicePath = (startAngle: number, endAngle: number, radius: number) => {
    // Convert from percentage to radians
    const startRad = (startAngle / 100) * Math.PI * 2;
    const endRad = (endAngle / 100) * Math.PI * 2;
    
    // Calculate coordinates
    const x1 = 100 + radius * Math.cos(startRad - Math.PI / 2);
    const y1 = 100 + radius * Math.sin(startRad - Math.PI / 2);
    const x2 = 100 + radius * Math.cos(endRad - Math.PI / 2);
    const y2 = 100 + radius * Math.sin(endRad - Math.PI / 2);
    
    // Create SVG path
    const largeArcFlag = endAngle - startAngle > 50 ? 1 : 0;
    
    return `M 100 100 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  if (expensesByCategory.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6">Expenses Breakdown</h2>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No expense data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6">Expenses Breakdown</h2>
      
      <div className="flex flex-col md:flex-row justify-between items-center">
        {/* Pie Chart */}
        <div className="relative w-48 h-48 md:w-52 md:h-52">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {pieChartData.map((slice, index) => (
              <path
                key={slice.categoryId}
                d={getSlicePath(slice.startAngle, slice.endAngle, 80)}
                fill={slice.color}
                stroke="#fff"
                strokeWidth="1"
              >
                <title>{`${slice.categoryName}: ${formatCurrency(slice.amount)} (${slice.percentage.toFixed(1)}%)`}</title>
              </path>
            ))}
            {/* Optional: Add a hole in the middle for a donut chart effect */}
            <circle cx="100" cy="100" r="40" fill="white" className="dark:fill-gray-800" />
          </svg>
        </div>
        
        {/* Legend */}
        <div className="mt-6 md:mt-0 md:ml-6 grid grid-cols-1 gap-2 w-full md:w-auto md:max-w-xs">
          {pieChartData.slice(0, 5).map((category) => (
            <div key={category.categoryId} className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                  {category.categoryName}
                </span>
              </div>
              <div className="flex items-center text-right">
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                  {formatCurrency(category.amount)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-500 ml-1 w-12">
                  ({category.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
          
          {expensesByCategory.length > 5 && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
              + {expensesByCategory.length - 5} more categories
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpensesByPieChart; 