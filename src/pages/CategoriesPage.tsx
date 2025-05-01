import React from 'react';
import CategoryList from '../components/categories/CategoryList';

const CategoriesPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Categories</h1>
      <CategoryList />
    </div>
  );
};

export default CategoriesPage;