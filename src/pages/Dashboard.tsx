import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { calculateBalance } from '../utils/helpers';
import BalanceCard from '../components/dashboard/BalanceCard';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import ExpensesByCategoryChart from '../components/dashboard/ExpensesByCategoryChart';
import ExpensesByPieChart from '../components/dashboard/ExpensesByPieChart';
import IncomeVsExpenseChart from '../components/dashboard/IncomeVsExpenseChart';

const Dashboard: React.FC = () => {
  const { state } = useAppContext();
  const navigate = useNavigate();
  
  // Calculate balance
  const balance = calculateBalance(state.transactions);
  
  // Sort transactions by date (newest first)
  const sortedTransactions = [...state.transactions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const handleAddTransaction = () => {
    navigate('/transactions/new');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Dashboard</h1>
      
      {state.transactions.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-gray-100 dark:border-gray-700 text-center">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Welcome to BudgetBuddy!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start by adding your first transaction to track your finances.
          </p>
          <button
            onClick={handleAddTransaction}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Add Transaction
          </button>
        </div>
      ) : (
        <div>
          {/* Main stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-1">
              <BalanceCard balance={balance} />
            </div>
            <div className="lg:col-span-2">
              <IncomeVsExpenseChart transactions={state.transactions} />
            </div>
          </div>
          
          {/* Secondary stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <RecentTransactions 
                transactions={sortedTransactions} 
                categories={state.categories}
              />
            </div>
            <div className="lg:col-span-1">
              <ExpensesByCategoryChart 
                transactions={state.transactions}
                categories={state.categories}
              />
            </div>
            <div className="lg:col-span-1">
              <ExpensesByPieChart 
                transactions={state.transactions}
                categories={state.categories}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;