import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FilterIcon, 
  PlusCircle, 
  Search, 
  Edit, 
  Trash, 
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { Transaction, Category, TransactionType } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { 
  formatCurrency, 
  formatDate, 
  getTransactionTypeProperties, 
  filterTransactions 
} from '../../utils/helpers';

const TransactionList: React.FC = () => {
  const { state, deleteTransaction } = useAppContext();
  const navigate = useNavigate();
  
  // State for filters
  const [filters, setFilters] = useState({
    type: 'all' as TransactionType | 'all',
    category: '',
    startDate: '',
    endDate: '',
    search: '',
  });
  
  // State for showing filter panel
  const [showFilters, setShowFilters] = useState(false);
  
  // State for sorting
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Apply filters and sorting
  const filteredTransactions = useMemo(() => {
    const filtered = filterTransactions(state.transactions, filters);
    
    // Apply sorting
    return [...filtered].sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
    });
  }, [state.transactions, filters, sortBy, sortOrder]);

  // Function to get category by id
  const getCategoryById = (id: string): Category | undefined => {
    return state.categories.find((category) => category.id === id);
  };

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      type: 'all',
      category: '',
      startDate: '',
      endDate: '',
      search: '',
    });
  };

  // Handle sort
  const handleSort = (column: 'date' | 'amount') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  // Navigate to add transaction
  const handleAddTransaction = () => {
    navigate('/transactions/new');
  };

  // Navigate to edit transaction
  const handleEditTransaction = (id: string) => {
    navigate(`/transactions/edit/${id}`);
  };

  // Delete transaction with confirmation
  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Transactions</h2>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <FilterIcon size={16} />
            <span>Filters</span>
          </button>
          
          <button
            onClick={handleAddTransaction}
            className="flex items-center space-x-1 px-3 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <PlusCircle size={16} />
            <span>Add</span>
          </button>
        </div>
      </div>
      
      {/* Search */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search transactions..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 focus:outline-none dark:bg-gray-700 dark:text-white"
        />
        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        {filters.search && (
          <button
            onClick={() => setFilters({ ...filters, search: '' })}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X size={16} />
          </button>
        )}
      </div>
      
      {/* Filter panel */}
      {showFilters && (
        <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type
              </label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Categories</option>
                {state.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                From
              </label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                To
              </label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
            >
              Clear filters
            </button>
          </div>
        </div>
      )}
      
      {/* Transactions table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b dark:border-gray-700">
              <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400">Description</th>
              <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400">Category</th>
              <th 
                className="pb-3 font-semibold text-gray-600 dark:text-gray-400 cursor-pointer"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center">
                  Date
                  {sortBy === 'date' && (
                    sortOrder === 'asc' ? 
                    <ChevronUp size={16} className="ml-1" /> : 
                    <ChevronDown size={16} className="ml-1" />
                  )}
                </div>
              </th>
              <th 
                className="pb-3 font-semibold text-gray-600 dark:text-gray-400 cursor-pointer"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center">
                  Amount
                  {sortBy === 'amount' && (
                    sortOrder === 'asc' ? 
                    <ChevronUp size={16} className="ml-1" /> : 
                    <ChevronDown size={16} className="ml-1" />
                  )}
                </div>
              </th>
              <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400">Type</th>
              <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-500 dark:text-gray-400">
                  No transactions found
                </td>
              </tr>
            ) : (
              filteredTransactions.map((transaction) => {
                const category = getCategoryById(transaction.category);
                const typeProps = getTransactionTypeProperties(transaction.type);
                
                return (
                  <tr 
                    key={transaction.id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  >
                    <td className="py-4 pr-2">
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {transaction.description}
                      </span>
                    </td>
                    
                    <td className="py-4 pr-2">
                      {category && (
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: category.color }}
                          ></div>
                          <span className="text-gray-700 dark:text-gray-300">
                            {category.name}
                          </span>
                        </div>
                      )}
                    </td>
                    
                    <td className="py-4 pr-2 text-gray-700 dark:text-gray-300">
                      {formatDate(transaction.date)}
                    </td>
                    
                    <td className={`py-4 pr-2 font-medium ${typeProps.textColor}`}>
                      {typeProps.sign}{formatCurrency(transaction.amount)}
                    </td>
                    
                    <td className="py-4 pr-2">
                      <span 
                        className={`px-2 py-1 rounded text-xs font-medium ${typeProps.bgColor} ${typeProps.textColor}`}
                      >
                        {typeProps.label}
                      </span>
                    </td>
                    
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditTransaction(transaction.id)}
                          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          aria-label="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className="p-1 text-gray-500 hover:text-rose-500 dark:text-gray-400 dark:hover:text-rose-400"
                          aria-label="Delete"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;