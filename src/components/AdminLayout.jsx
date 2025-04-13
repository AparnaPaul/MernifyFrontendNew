// src/components/layout/AdminLayout.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Home, Info, MenuIcon, ShoppingBag, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import clsx from 'clsx';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  const navItems = [
    { label: 'Home', icon: Home, path: '/adminDashboard' },
    { label: 'Orders', icon: ShoppingBag, path: '/admin/orders' },
    { label: 'Info', icon: Info, path: '/admin/info' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className={clsx(
        'fixed lg:relative z-50 h-full shadow-lg transition-transform duration-300 bg-background/50 border-b backdrop-blur',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <div className="flex flex-col h-full p-4">
          <h1 className="text-lg font-bold mb-4">Admin Panel</h1>
          <div className="space-y-4">
            {navItems.map(({ label, icon: Icon, path }) => (
              <Button
                key={label}
                variant="ghost"
                onClick={() => navigate(path)}
                className={clsx(
                  'w-full flex items-center gap-2',
                  location.pathname === path && 'bg-gray-500'
                )}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Button>
            ))}
            <Button
              variant="ghost"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" /> Close
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <div className="shadow p-4 flex items-center justify-between lg:justify-end">
          <Button
            variant="outline"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <MenuIcon className="w-5 h-5" />
          </Button>
          <h2 className="text-lg font-bold lg:block">Admin Dashboard</h2>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
