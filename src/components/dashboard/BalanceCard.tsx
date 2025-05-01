import React from 'react';
import { ArrowUp, ArrowDown, Wallet } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import { Balance } from '../../types';

interface BalanceCardProps {
  balance: Balance;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 transition-all">
      <div className="flex items-start justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Current Balance</h2>
        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
          <Wallet size={20} className="text-emerald-500 dark:text-emerald-400" />
        </div>
      </div>
      
      <div className="mb-6">
        <p className="text-3xl font-bold text-gray-800 dark:text-white">
          {formatCurrency(balance.total)}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your total balance</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <div className="flex items-center">
            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mr-2">
              <ArrowUp size={14} className="text-emerald-500" />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Income</span>
          </div>
          <p className="mt-2 text-lg font-semibold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(balance.income)}
          </p>
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center">
            <div className="p-1.5 bg-rose-100 dark:bg-rose-900/30 rounded-full mr-2">
              <ArrowDown size={14} className="text-rose-500" />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Expenses</span>
          </div>
          <p className="mt-2 text-lg font-semibold text-rose-600 dark:text-rose-400">
            {formatCurrency(balance.expense)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;