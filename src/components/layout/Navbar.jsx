import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Menu, X, Flame, LayoutDashboard, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount, wishlist, currentUser, logout } = useApp();

  const navLinks = [
    { path: '/', label: 'Menu' },
    { path: '/group-order', label: 'Group Order' },
    { path: '/orders', label: 'My Orders' },
    { path: '/rewards', label: '⭐ Rewards' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            {/* <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Flame className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight">
              Blaze<span className="text-primary">Bites</span>
            </span> */}
              <img
              className="w-40 h-50 bg-none rounded-xl flex items-center justify-center"
              src="/logo-brand-name-jinipizza-removebg-preview.png"
              alt=""
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <Button variant={isActive(link.path) ? "default" : "ghost"} size="sm" className="font-medium">
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1">
            {currentUser?.role === 'admin' && (
              <Link to="/admin">
                <Button variant="ghost" size="icon"><LayoutDashboard className="w-5 h-5" /></Button>
              </Link>
            )}
            <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-bold">{wishlist.length}</span>
                )}
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </motion.span>
                )}
              </Button>
            </Link>

            {currentUser ? (
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                <LogOut className="w-5 h-5" />
              </Button>
            ) : (
              <Link to="/login">
                <Button size="sm" className="hidden sm:flex font-semibold">Sign In</Button>
              </Link>
            )}

            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden border-t border-border bg-card">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)} className="block">
                  <Button variant={isActive(link.path) ? "default" : "ghost"} className="w-full justify-start">{link.label}</Button>
                </Link>
              ))}
              {!currentUser ? (
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block">
                  <Button className="w-full justify-start">Sign In</Button>
                </Link>
              ) : (
                <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}