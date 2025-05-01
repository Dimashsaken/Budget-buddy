import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Moon, Sun, RefreshCw, Download, Upload } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { state, toggleDarkMode } = useAppContext();

  // Export data to JSON file
  const handleExportData = () => {
    const data = {
      transactions: state.transactions,
      categories: state.categories,
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `budgetbuddy_backup_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Import data from JSON file
  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (!target.files?.length) return;
      
      const file = target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const result = event.target?.result as string;
          const data = JSON.parse(result);
          
          if (data.transactions && data.categories) {
            // In a real app, we would dispatch actions to update the state
            alert('Data imported successfully! (Feature would be implemented in a real app)');
          } else {
            alert('Invalid data format');
          }
        } catch (error) {
          alert('Failed to parse the imported file');
        }
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  };

  // Reset all data
  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      // In a real app, we would dispatch actions to reset the state
      localStorage.removeItem('budgetbuddy_transactions');
      localStorage.removeItem('budgetbuddy_categories');
      window.location.reload();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Settings</h1>
      
      <div className="space-y-6">
        {/* Appearance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Appearance</h2>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">Dark Mode</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark mode</p>
            </div>
            
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle dark mode"
            >
              {state.darkMode ? (
                <Sun size={20} className="text-amber-500" />
              ) : (
                <Moon size={20} className="text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
        
        {/* Data Management */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Data Management</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b dark:border-gray-700">
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Export Data</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Download all your data as a JSON file</p>
              </div>
              
              <button
                onClick={handleExportData}
                className="flex items-center space-x-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b dark:border-gray-700">
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Import Data</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Restore data from a backup file</p>
              </div>
              
              <button
                onClick={handleImportData}
                className="flex items-center space-x-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Upload size={16} />
                <span>Import</span>
              </button>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Reset Data</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Delete all data and start fresh</p>
              </div>
              
              <button
                onClick={handleResetData}
                className="flex items-center space-x-1 px-3 py-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-200 dark:hover:bg-rose-900/50 transition-colors"
              >
                <RefreshCw size={16} />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* About */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">About</h2>
          
          <div className="text-gray-700 dark:text-gray-300">
            <p>BudgetBuddy v1.0.0</p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              A personal finance management application to help you track your income and expenses.
            </p>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              © 2025 BudgetBuddy. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;