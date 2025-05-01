import React from 'react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import { useAppContext } from '../../context/AppContext';
import { Sun, Moon } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { state, toggleDarkMode } = useAppContext();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar for desktop */}
        <div className="hidden md:block w-64 fixed h-screen">
          <Sidebar />
        </div>

        {/* Main content */}
        <div className="md:ml-64 flex-1 min-h-screen">
          {/* Top bar with theme toggle */}
          <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm">
            <div className="px-4 py-3 flex justify-between items-center">
              <h1 className="text-xl font-bold text-gray-800 dark:text-white md:hidden">
                BudgetBuddy
              </h1>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle dark mode"
              >
                {state.darkMode ? (
                  <Sun size={20} />
                ) : (
                  <Moon size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Page content */}
          <main className="p-4 md:p-6">{children}</main>

          {/* Mobile navigation */}
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;