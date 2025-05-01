import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListOrdered, Wallet, PieChart, Settings } from 'lucide-react';

const MobileNav: React.FC = () => {
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
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 shadow-lg z-10">
      <nav className="flex justify-around">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center py-3 flex-1 transition-colors ${
              isActive(item.path)
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            <span className={isActive(item.path) ? 'text-emerald-500' : ''}>{item.icon}</span>
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default MobileNav;