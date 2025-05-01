import React, { useState } from 'react';
import { PlusCircle, Edit, Trash, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Category, TransactionType } from '../../types';
import { useAppContext } from '../../context/AppContext';
import CategoryForm from './CategoryForm';
import { formatCurrency, formatDate, getTransactionTypeProperties } from '../../utils/helpers';

const CategoryList: React.FC = () => {
  const { state, deleteCategory } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [activeTab, setActiveTab] = useState<TransactionType>('expense');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  
  // Filter categories by type
  const filteredCategories = state.categories.filter(
    (category) => category.type === activeTab
  );

  // Get transactions for a category
  const getCategoryTransactions = (categoryId: string) => {
    return state.transactions
      .filter(t => t.category === categoryId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  // Calculate total amount for a category
  const getCategoryTotal = (categoryId: string) => {
    return state.transactions
      .filter(t => t.category === categoryId)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  // Handle edit category
  const handleEditCategory = (category: Category) => {
    setEditCategory(category);
    setShowForm(true);
  };

  // Handle form close
  const handleFormClose = () => {
    setShowForm(false);
    setEditCategory(null);
  };

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  // Delete category with confirmation
  const handleDeleteCategory = (id: string) => {
    const isUsed = state.transactions.some((t) => t.category === id);
    
    if (isUsed) {
      alert('This category cannot be deleted because it is being used in transactions.');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory(id);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Categories</h2>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-1 px-3 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          <PlusCircle size={16} />
          <span>Add Category</span>
        </button>
      </div>
      
      {/* Tabs */}
      <div className="flex space-x-2 mb-6 border-b dark:border-gray-700">
        <button
          onClick={() => setActiveTab('expense')}
          className={`px-4 py-2 text-sm font-medium -mb-px ${
            activeTab === 'expense'
              ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          Expense Categories
        </button>
        <button
          onClick={() => setActiveTab('income')}
          className={`px-4 py-2 text-sm font-medium -mb-px ${
            activeTab === 'income'
              ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          Income Categories
        </button>
      </div>
      
      {/* Categories grid */}
      <div className="space-y-4">
        {filteredCategories.map((category) => {
          const transactions = getCategoryTransactions(category.id);
          const total = getCategoryTotal(category.id);
          const isExpanded = expandedCategory === category.id;
          
          return (
            <div 
              key={category.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            >
              {/* Category header */}
              <div 
                className="p-4 bg-gray-50 dark:bg-gray-700/30 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <span style={{ color: category.color }}>
                        {category.icon.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-gray-200">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {transactions.length} transactions
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {formatCurrency(total)}
                    </span>
                    {isExpanded ? (
                      <ChevronUp size={20} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
              
              {/* Transactions list */}
              {isExpanded && (
                <div className="divide-y dark:divide-gray-700">
                  {transactions.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      No transactions in this category
                    </div>
                  ) : (
                    transactions.map((transaction) => {
                      const typeProps = getTransactionTypeProperties(transaction.type);
                      
                      return (
                        <div 
                          key={transaction.id}
                          className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-800 dark:text-gray-200">
                                {transaction.description}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(transaction.date)}
                              </p>
                            </div>
                            <p className={`font-semibold ${typeProps.textColor}`}>
                              {typeProps.sign}{formatCurrency(transaction.amount)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
              
              {/* Category actions */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/30 flex justify-end space-x-2">
                <button
                  onClick={() => handleEditCategory(category)}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label="Edit"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="p-1 text-gray-500 hover:text-rose-500 dark:text-gray-400 dark:hover:text-rose-400"
                  aria-label="Delete"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Category form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 m-4 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                {editCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <button
                onClick={handleFormClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <XCircle size={20} />
              </button>
            </div>
            
            <CategoryForm 
              category={editCategory}
              onClose={handleFormClose}
              defaultType={activeTab}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;