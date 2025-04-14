import React, { useState } from 'react'
import HomePage from './HomePage'
import AdminLayout from '@/components/AdminLayout';


const AdminDashboard = () => {
  return (
    <AdminLayout>
      <HomePage />
    </AdminLayout>
  );
};

export default AdminDashboard;
