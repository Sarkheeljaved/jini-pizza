import React from 'react';
import { Outlet } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import Navbar from './Navbar';
import Footer from './Footer';

export default function AppLayout() {
  const { cartCount, wishlist, currentUser } = useApp();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        isAdmin={currentUser?.role === 'admin'}
        currentUser={currentUser}
      />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}