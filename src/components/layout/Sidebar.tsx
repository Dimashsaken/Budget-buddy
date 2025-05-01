import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ListOrdered, 
  Wallet, 
  PieChart, 
  Settings, 
  CircleDollarSign
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/transactions', label: 'Transactions', icon: <ListOrdered size={20} /> },
    { path: '/categories', label: 'Categories', icon: <Wallet size={20} /> },
    { path: '/analytics', label: 'Analytics', icon: <PieChart size={20} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  // Function to check if a nav item is active
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/';
  };

  return (
    <div className="h-full bg-white dark:bg-gray-800 border-r dark:border-gray-700 shadow-sm flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <CircleDollarSign size={24} className="text-emerald-500" />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">BudgetBuddy</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className={isActive(item.path) ? 'text-emerald-500' : ''}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2025 BudgetBuddy</p>
      </div>
    </div>
  );
};

export default Sidebar;