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
    
    // Process last 6 months for better line chart visualization
    const today = new Date();
    for (let i = 0; i < 6; i++) {
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
    
    // Convert to array and sort by month (oldest to newest)
    return Object.values(months).reverse();
  }, [transactions]);

  // Maximum value for chart scaling
  const maxValue = useMemo(() => {
    if (monthlyData.length === 0) return 1000;
    
    const values = monthlyData.flatMap(data => [data.income, data.expense]);
    return Math.max(...values, 1000) * 1.1; // Add 10% margin for better visualization
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

  const chartHeight = 220;
  const chartWidth = 100;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6">Income vs Expenses</h2>
      
      {/* Line Chart */}
      <div className="relative h-60 mb-8">
        {/* Y-axis labels */}
        <div className="absolute top-0 left-0 h-full flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{formatCurrency(maxValue)}</span>
          <span>{formatCurrency(maxValue / 2)}</span>
          <span>0</span>
        </div>
        
        {/* Chart area */}
        <div className="ml-16 h-full relative">
          {/* Horizontal grid lines */}
          <div className="absolute w-full h-full">
            <div className="h-1/2 border-b border-gray-200 dark:border-gray-700"></div>
            <div className="h-1/2 border-b border-gray-200 dark:border-gray-700"></div>
          </div>
          
          {/* Data visualization */}
          <svg 
            className="w-full h-full overflow-visible" 
            preserveAspectRatio="none"
            viewBox={`0 0 ${(monthlyData.length - 1) * chartWidth} ${chartHeight}`}
          >
            {/* Income line */}
            <polyline
              points={monthlyData.map((data, i) => 
                `${i * chartWidth},${chartHeight - (data.income / maxValue) * chartHeight}`
              ).join(' ')}
              fill="none"
              stroke="#10B981" // emerald-500
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Expense line */}
            <polyline
              points={monthlyData.map((data, i) => 
                `${i * chartWidth},${chartHeight - (data.expense / maxValue) * chartHeight}`
              ).join(' ')}
              fill="none"
              stroke="#F43F5E" // rose-500
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Income data points */}
            {monthlyData.map((data, i) => (
              <g key={`income-${i}`} className="group">
                <circle
                  cx={i * chartWidth}
                  cy={chartHeight - (data.income / maxValue) * chartHeight}
                  r="4"
                  fill="#10B981" // emerald-500
                  strokeWidth="2"
                  stroke="white"
                  className="cursor-pointer"
                />
                
                {/* Tooltip */}
                <g className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <rect
                    x={i * chartWidth - 40}
                    y={chartHeight - (data.income / maxValue) * chartHeight - 35}
                    width="80"
                    height="25"
                    rx="4"
                    fill="#1F2937" // gray-800
                  />
                  <text
                    x={i * chartWidth}
                    y={chartHeight - (data.income / maxValue) * chartHeight - 18}
                    textAnchor="middle"
                    fill="white"
                    fontSize="10"
                  >
                    {formatCurrency(data.income)}
                  </text>
                </g>
              </g>
            ))}
            
            {/* Expense data points */}
            {monthlyData.map((data, i) => (
              <g key={`expense-${i}`} className="group">
                <circle
                  cx={i * chartWidth}
                  cy={chartHeight - (data.expense / maxValue) * chartHeight}
                  r="4"
                  fill="#F43F5E" // rose-500
                  strokeWidth="2"
                  stroke="white"
                  className="cursor-pointer"
                />
                
                {/* Tooltip */}
                <g className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <rect
                    x={i * chartWidth - 40}
                    y={chartHeight - (data.expense / maxValue) * chartHeight - 35}
                    width="80"
                    height="25"
                    rx="4"
                    fill="#1F2937" // gray-800
                  />
                  <text
                    x={i * chartWidth}
                    y={chartHeight - (data.expense / maxValue) * chartHeight - 18}
                    textAnchor="middle"
                    fill="white"
                    fontSize="10"
                  >
                    {formatCurrency(data.expense)}
                  </text>
                </g>
              </g>
            ))}
          </svg>
        </div>
        
        {/* X-axis labels (months) */}
        <div className="ml-16 flex justify-between mt-2">
          {monthlyData.map((data, i) => (
            <div key={i} className="text-xs text-gray-500 dark:text-gray-400">
              {data.month}
            </div>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-2 pt-4 border-t dark:border-gray-700 flex justify-center">
        <div className="flex items-center mr-4">
          <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Income</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-rose-500 mr-2"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Expense</span>
        </div>
      </div>
    </div>
  );
};

export default IncomeVsExpenseChart;