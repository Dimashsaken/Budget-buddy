import React, { useMemo } from 'react';
import { Transaction } from '../../types';
import { formatCurrency } from '../../utils/helpers';

interface IncomeVsExpenseChartProps {
  transactions: Transaction[];
}

interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

const IncomeVsExpenseChart: React.FC<IncomeVsExpenseChartProps> = ({ transactions }) => {
  // Get monthly income and expenses
  const monthlyData = useMemo(() => {
    // If no transactions, return empty array
    if (transactions.length === 0) {
      return [];
    }

    // Group transactions by month
    const months: Record<string, MonthlyData> = {};
    
    // Process last 3 months
    const today = new Date();
    for (let i = 0; i < 3; i++) {
      const date = new Date(today);
      date.setMonth(today.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleString('default', { month: 'short' });
      
      months[monthKey] = {
        month: monthName,
        income: 0,
        expense: 0
      };
    }
    
    // Add transaction amounts to respective months
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (months[monthKey]) {
        if (transaction.type === 'income') {
          months[monthKey].income += transaction.amount;
        } else {
          months[monthKey].expense += transaction.amount;
        }
      }
    });
    
    // Convert to array and sort by month
    return Object.values(months).reverse();
  }, [transactions]);

  // Maximum value for chart scaling
  const maxValue = useMemo(() => {
    if (monthlyData.length === 0) return 1000;
    
    const values = monthlyData.flatMap(data => [data.income, data.expense]);
    return Math.max(...values, 1000); // Minimum 1000 for better visualization
  }, [monthlyData]);

  if (transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6">Income vs Expenses</h2>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No transaction data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6">Income vs Expenses</h2>
      
      {/* Chart */}
      <div className="h-60 flex items-end justify-between">
        {monthlyData.map((data, index) => (
          <div key={index} className="flex flex-col items-center w-1/4">
            {/* Income bar */}
            <div className="w-8 rounded-t-md bg-emerald-400 dark:bg-emerald-500 mb-1 relative group">
              <div 
                className="absolute bottom-0 w-full"
                style={{ height: `${(data.income / maxValue) * 100}%` }}
              >
                <div className="h-full w-full bg-emerald-400 dark:bg-emerald-500 rounded-t"></div>
                <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded transition-opacity whitespace-nowrap">
                  {formatCurrency(data.income)}
                </div>
              </div>
            </div>
            
            {/* Expense bar */}
            <div className="w-8 rounded-t-md bg-rose-400 dark:bg-rose-500 mb-1 relative group">
              <div 
                className="absolute bottom-0 w-full"
                style={{ height: `${(data.expense / maxValue) * 100}%` }}
              >
                <div className="h-full w-full bg-rose-400 dark:bg-rose-500 rounded-t"></div>
                <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded transition-opacity whitespace-nowrap">
                  {formatCurrency(data.expense)}
                </div>
              </div>
            </div>
            
            {/* Month label */}
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{data.month}</p>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="mt-6 pt-4 border-t dark:border-gray-700 flex justify-center">
        <div className="flex items-center mr-4">
          <div className="w-3 h-3 rounded-full bg-emerald-400 dark:bg-emerald-500 mr-2"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Income</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-rose-400 dark:bg-rose-500 mr-2"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Expense</span>
        </div>
      </div>
    </div>
  );
};

export default IncomeVsExpenseChart;