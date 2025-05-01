import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Category, TransactionType } from '../../types';

const COLORS = [
  '#10B981', // emerald-500
  '#3B82F6', // blue-500
  '#8B5CF6', // violet-500
  '#EC4899', // pink-500
  '#F97316', // orange-500
  '#14B8A6', // teal-500
  '#6366F1', // indigo-500
  '#F43F5E', // rose-500
  '#EAB308', // yellow-500
  '#06B6D4', // cyan-500
];

const ICONS = [
  'home',
  'car',
  'food',
  'gift',
  'bill',
  'shop',
  'gym',
  'edu',
  'med',
  'fun',
  'tech',
  'pet',
  'tax',
  'pay',
  'cash',
];

interface CategoryFormProps {
  category: Category | null;
  onClose: () => void;
  defaultType?: TransactionType;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onClose,
  defaultType = 'expense',
}) => {
  const { addCategory, updateCategory } = useAppContext();
  
  const [formData, setFormData] = useState<Omit<Category, 'id'>>({
    name: '',
    color: COLORS[0],
    icon: ICONS[0],
    type: defaultType,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load category data if in edit mode
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        color: category.color,
        icon: category.icon,
        type: category.type,
      });
    } else {
      setFormData({
        ...formData,
        type: defaultType,
      });
    }
  }, [category, defaultType]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // Handle color selection
  const handleColorSelect = (color: string) => {
    setFormData({
      ...formData,
      color,
    });
  };

  // Handle icon selection
  const handleIconSelect = (icon: string) => {
    setFormData({
      ...formData,
      icon,
    });
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter a category name';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (category) {
        updateCategory({
          id: category.id,
          ...formData,
        });
      } else {
        addCategory(formData);
      }
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Category Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Category Type
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
      
      {/* Category Name */}
      <div className="mb-6">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Category Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`
            w-full p-3 border rounded-lg focus:ring-2 focus:outline-none
            ${errors.name ? 'border-rose-500 focus:ring-rose-200' : 'border-gray-300 dark:border-gray-600 focus:ring-emerald-200 dark:focus:ring-emerald-800'}
            dark:bg-gray-700 dark:text-white
          `}
          placeholder="e.g., Groceries, Salary, Entertainment"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-rose-500">{errors.name}</p>
        )}
      </div>
      
      {/* Color Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Color
        </label>
        <div className="grid grid-cols-5 gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handleColorSelect(color)}
              className={`
                w-10 h-10 rounded-full 
                ${formData.color === color ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-700' : ''}
              `}
              style={{ backgroundColor: color }}
              aria-label={`Color ${color}`}
            />
          ))}
        </div>
      </div>
      
      {/* Icon Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Icon
        </label>
        <div className="grid grid-cols-5 gap-2">
          {ICONS.map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => handleIconSelect(icon)}
              className={`
                w-10 h-10 rounded-lg flex items-center justify-center
                ${formData.icon === icon 
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}
                hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors
              `}
              aria-label={`Icon ${icon}`}
            >
              {icon.charAt(0).toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      
      {/* Preview */}
      <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview</h4>
        <div className="flex items-center">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
            style={{ backgroundColor: `${formData.color}20` }}
          >
            <span style={{ color: formData.color }}>
              {formData.icon.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="font-medium text-gray-800 dark:text-gray-200">
            {formData.name || 'Category Name'}
          </span>
        </div>
      </div>
      
      {/* Submit buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          {category ? 'Update' : 'Add'} Category
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;