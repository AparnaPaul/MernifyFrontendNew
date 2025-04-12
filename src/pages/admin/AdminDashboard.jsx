import React, { useState } from 'react'
import HomePage from './HomePage'
import AllOrders from './AllOrders'
import InfoPage from './InfoPage'
import { Button } from '@/components/ui/button';
import { Home, Info, MenuIcon, ShoppingBag, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/AdminLayout';


const AdminDashboard = () => {
  return (
    <AdminLayout>
      <HomePage />
    </AdminLayout>
  );
};

export default AdminDashboard;
