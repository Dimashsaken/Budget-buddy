import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';
import ExpensesByCategoryChart from '../components/dashboard/ExpensesByCategoryChart';
import IncomeVsExpenseChart from '../components/dashboard/IncomeVsExpenseChart';

const AnalyticsPage: React.FC = () => {
  const { state } = useAppContext();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year' | 'all'>('month');
  
  // Filter transactions based on time range
  const filteredTransactions = useMemo(() => {
    if (timeRange === 'all') {
      return state.transactions;
    }
    
    const now = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(0); // Beginning of time
    }
    
    return state.transactions.filter(
      (t) => new Date(t.date) >= startDate
    );
  }, [state.transactions, timeRange]);
  
  // Calculate income, expenses, and savings
  const financialSummary = useMemo(() => {
    const income = filteredTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = filteredTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const savings = income - expenses;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;
    
    return {
      income,
      expenses,
      savings,
      savingsRate,
    };
  }, [filteredTransactions]);
  
  // Get top expense categories
  const topExpenseCategories = useMemo(() => {
    // Filter only expenses
    const expenses = filteredTransactions.filter(t => t.type === 'expense');
    
    // Group expenses by category
    const grouped: Record<string, number> = {};
    expenses.forEach(transaction => {
      if (grouped[transaction.category]) {
        grouped[transaction.category] += transaction.amount;
      } else {
        grouped[transaction.category] = transaction.amount;
      }
    });
    
    // Convert to array and sort by amount
    return Object.entries(grouped)
      .map(([categoryId, amount]) => {
        const category = state.categories.find(c => c.id === categoryId);
        return {
          categoryId,
          categoryName: category?.name || 'Unknown',
          color: category?.color || '#CBD5E1',
          amount,
        };
      })
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5); // Get top 5
  }, [filteredTransactions, state.categories]);
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Analytics</h1>
      
      {/* Time range selector */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Financial Analytics</h2>
          <div className="flex">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1 text-sm rounded-l-lg ${
                timeRange === 'week'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1 text-sm ${
                timeRange === 'month'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeRange('year')}
              className={`px-3 py-1 text-sm ${
                timeRange === 'year'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Year
            </button>
            <button
              onClick={() => setTimeRange('all')}
              className={`px-3 py-1 text-sm rounded-r-lg ${
                timeRange === 'all'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All Time
            </button>
          </div>
        </div>
        
        {/* Financial summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Income</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(financialSummary.income)}
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</p>
            <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">
              {formatCurrency(financialSummary.expenses)}
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Savings</p>
            <p className={`text-2xl font-bold ${
              financialSummary.savings >= 0 
                ? 'text-emerald-600 dark:text-emerald-400' 
                : 'text-rose-600 dark:text-rose-400'
            }`}>
              {formatCurrency(financialSummary.savings)}
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Savings Rate</p>
            <p className={`text-2xl font-bold ${
              financialSummary.savingsRate >= 0 
                ? 'text-emerald-600 dark:text-emerald-400' 
                : 'text-rose-600 dark:text-rose-400'
            }`}>
              {financialSummary.savingsRate.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <IncomeVsExpenseChart transactions={filteredTransactions} />
        </div>
        <div>
          <ExpensesByCategoryChart 
            transactions={filteredTransactions}
            categories={state.categories}
          />
        </div>
      </div>
      
      {/* Top Expense Categories */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Top Expense Categories</h2>
        
        {topExpenseCategories.length === 0 ? (
          <p className="text-center py-4 text-gray-500 dark:text-gray-400">
            No expense data available
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b dark:border-gray-700">
                  <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400">Category</th>
                  <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400">Amount</th>
                  <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400">% of Expenses</th>
                </tr>
              </thead>
              <tbody>
                {topExpenseCategories.map((category) => (
                  <tr 
                    key={category.categoryId}
                    className="border-b dark:border-gray-700"
                  >
                    <td className="py-4 pr-2">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {category.categoryName}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 pr-2 text-gray-700 dark:text-gray-300">
                      {formatCurrency(category.amount)}
                    </td>
                    <td className="py-4 pr-2 text-gray-700 dark:text-gray-300">
                      {financialSummary.expenses > 0 
                        ? ((category.amount / financialSummary.expenses) * 100).toFixed(1) 
                        : '0'}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;