import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CalendarIcon, X } from 'lucide-react';
import { Transaction, Category, TransactionType } from '../../types';
import { useAppContext } from '../../context/AppContext';

interface TransactionFormProps {
  editMode?: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ editMode = false }) => {
  const { state, addTransaction, updateTransaction } = useAppContext();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [formData, setFormData] = useState<Omit<Transaction, 'id'>>({
    amount: 0,
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load transaction data if in edit mode
  useEffect(() => {
    if (editMode && id) {
      const transaction = state.transactions.find(t => t.id === id);
      if (transaction) {
        setFormData({
          amount: transaction.amount,
          category: transaction.category,
          description: transaction.description,
          date: transaction.date.split('T')[0],
          type: transaction.type,
        });
      } else {
        // Redirect if transaction not found
        navigate('/transactions');
      }
    }
  }, [editMode, id, state.transactions, navigate]);

  // Filter categories based on selected type
  const filteredCategories = state.categories.filter(
    (category) => category.type === formData.type
  );

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } else if (name === 'type') {
      // Reset category when type changes
      setFormData({
        ...formData,
        [name]: value as TransactionType,
        category: '',
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Please enter a description';
    }
    
    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (editMode && id) {
        updateTransaction({
          id,
          ...formData,
        });
        navigate('/transactions');
      } else {
        addTransaction(formData);
        navigate('/transactions');
      }
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/transactions');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          {editMode ? 'Edit Transaction' : 'New Transaction'}
        </h2>
        <button
          onClick={handleCancel}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X size={20} className="text-gray-500 dark:text-gray-400" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Transaction Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Transaction Type
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label 
              className={`
                flex items-center justify-center p-3 rounded-lg border 
                ${formData.type === 'income' 
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' 
                  : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'}
                cursor-pointer transition-all
              `}
            >
              <input
                type="radio"
                name="type"
                value="income"
                checked={formData.type === 'income'}
                onChange={handleChange}
                className="sr-only"
              />
              <span>Income</span>
            </label>
            
            <label 
              className={`
                flex items-center justify-center p-3 rounded-lg border 
                ${formData.type === 'expense' 
                  ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400' 
                  : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'}
                cursor-pointer transition-all
              `}
            >
              <input
                type="radio"
                name="type"
                value="expense"
                checked={formData.type === 'expense'}
                onChange={handleChange}
                className="sr-only"
              />
              <span>Expense</span>
            </label>
          </div>
        </div>
        
        {/* Amount */}
        <div className="mb-6">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Amount ($)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount || ''}
            onChange={handleChange}
            min="0"
            step="0.01"
            className={`
              w-full p-3 border rounded-lg focus:ring-2 focus:outline-none
              ${errors.amount ? 'border-rose-500 focus:ring-rose-200' : 'border-gray-300 dark:border-gray-600 focus:ring-emerald-200 dark:focus:ring-emerald-800'}
              dark:bg-gray-700 dark:text-white
            `}
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-rose-500">{errors.amount}</p>
          )}
        </div>
        
        {/* Category */}
        <div className="mb-6">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`
              w-full p-3 border rounded-lg focus:ring-2 focus:outline-none
              ${errors.category ? 'border-rose-500 focus:ring-rose-200' : 'border-gray-300 dark:border-gray-600 focus:ring-emerald-200 dark:focus:ring-emerald-800'}
              dark:bg-gray-700 dark:text-white
            `}
          >
            <option value="">Select a category</option>
            {filteredCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-rose-500">{errors.category}</p>
          )}
        </div>
        
        {/* Description */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`
              w-full p-3 border rounded-lg focus:ring-2 focus:outline-none
              ${errors.description ? 'border-rose-500 focus:ring-rose-200' : 'border-gray-300 dark:border-gray-600 focus:ring-emerald-200 dark:focus:ring-emerald-800'}
              dark:bg-gray-700 dark:text-white
            `}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-rose-500">{errors.description}</p>
          )}
        </div>
        
        {/* Date */}
        <div className="mb-6">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date
          </label>
          <div className="relative">
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`
                w-full p-3 border rounded-lg focus:ring-2 focus:outline-none
                ${errors.date ? 'border-rose-500 focus:ring-rose-200' : 'border-gray-300 dark:border-gray-600 focus:ring-emerald-200 dark:focus:ring-emerald-800'}
                dark:bg-gray-700 dark:text-white
              `}
            />
            <CalendarIcon size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          {errors.date && (
            <p className="mt-1 text-sm text-rose-500">{errors.date}</p>
          )}
        </div>
        
        {/* Submit button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            {editMode ? 'Update' : 'Add'} Transaction
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;