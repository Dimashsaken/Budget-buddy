import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Transaction, Category } from '../../types';
import { formatCurrency, formatDate, getTransactionTypeProperties } from '../../utils/helpers';

interface RecentTransactionsProps {
  transactions: Transaction[];
  categories: Category[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ 
  transactions, 
  categories 
}) => {
  const navigate = useNavigate();
  const recentTransactions = transactions.slice(0, 5);

  // Function to get category by id
  const getCategoryById = (id: string): Category | undefined => {
    return categories.find((category) => category.id === id);
  };

  // Navigate to transactions page
  const handleViewAll = () => {
    navigate('/transactions');
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Recent Transactions</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No transactions yet</p>
          <button 
            onClick={() => navigate('/transactions/new')}
            className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Add a transaction
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Recent Transactions</h2>
        <button 
          onClick={handleViewAll}
          className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline flex items-center"
        >
          View All
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
      
      <div className="space-y-4">
        {recentTransactions.map((transaction) => {
          const category = getCategoryById(transaction.category);
          const typeProps = getTransactionTypeProperties(transaction.type);
          
          return (
            <div 
              key={transaction.id}
              className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                {category && (
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <span style={{ color: category.color }}>
                      {/* Use icon from category */}
                      {category.icon && (
                        <span className="font-medium">{category.icon.charAt(0).toUpperCase()}</span>
                      )}
                    </span>
                  </div>
                )}
                
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(transaction.date)} · {category?.name}
                  </p>
                </div>
              </div>
              
              <p className={`font-semibold ${typeProps.textColor}`}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentTransactions;