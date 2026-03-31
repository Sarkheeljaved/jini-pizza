import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Package, LayoutGrid, ShoppingBag, Settings,
  Flame, ChevronLeft, Menu,LogOut, ExternalLink, Users
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

const navItems = [
  { path: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { path: '/admin/products', label: 'Products', icon: Package },
  { path: '/admin/categories', label: 'Categories', icon: LayoutGrid },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { path: '/admin/groups', label: 'Group Orders', icon: Users },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, currentUser } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isActive = (item) => item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path) && item.path !== '/admin';
  const isOverview = location.pathname === '/admin';

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} flex-shrink-0 bg-card border-r border-border flex flex-col transition-all duration-300 fixed inset-y-0 left-0 z-40`}>
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-border gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Link to={"/"} ><Flame className="w-5 h-5 text-white" /></Link>
          </div>
          {sidebarOpen && <span className="font-heading font-bold text-base">Jini-Pizza Admin</span>}
          <button onClick={() => setSidebarOpen(p => !p)} className="ml-auto text-muted-foreground hover:text-foreground">
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = isActive(item) || (item.exact && isOverview);
            return (
              <Link key={item.path} to={item.path}>
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-2 border-t border-border space-y-1">
          <Link to="/">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer">
              <ExternalLink className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="font-medium text-sm">View Store</span>}
            </div>
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium text-sm">Logout</span>}
          </button>
          {sidebarOpen && currentUser && (
            <div className="px-3 py-2 mt-1">
              <p className="text-xs font-medium truncate">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className={`flex-1 ${sidebarOpen ? 'ml-60' : 'ml-16'} transition-all duration-300 min-h-screen`}>
        <Outlet />
      </main>
    </div>
  );
}