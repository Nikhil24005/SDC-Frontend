import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../pages/admin/Header';
import Sidebar from '../pages/admin/Sidebar';
import { useAuth } from '../auth/AuthContext';

const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full bg-[#1E1E1E] text-white">
      {/* Top Header */}
      <Header admin={admin} handleLogout={handleLogout} />

      {/* Below Header: Sidebar + Main Content */}
      <div className="flex w-full">
        {/* Sidebar on the left */}
        <Sidebar />

        {/* Dynamic page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#EFEFEF26] min-h-[calc(100vh-101px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;



