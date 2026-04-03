import React, { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  LayoutGrid,
  ShoppingBag,
  Settings,
  Flame,
  ChevronLeft,
  Menu,
  X,
  LogOut,
  ExternalLink,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";

const navItems = [
  { path: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { path: "/admin/products", label: "Products", icon: Package },
  { path: "/admin/categories", label: "Categories", icon: LayoutGrid },
  { path: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { path: "/admin/groups", label: "Group Orders", icon: Users },
  { path: "/admin/settings", label: "Settings", icon: Settings },
];

function SidebarContent({
  sidebarOpen,
  setSidebarOpen,
  isActive,
  isOverview,
  currentUser,
  handleLogout,
  isMobile,
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-border gap-3 flex-shrink-0">
        {/* <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
          <Flame className="w-5 h-5 text-white" />
        </div> */}
        {(sidebarOpen || isMobile) && (
           <img
              className="w-40 h-50 bg-none rounded-xl flex items-center justify-center"
              src="/logo-brand-name-jinipizza-removebg-preview.png"
              alt=""
            />
            // <span className="font-heading font-bold text-base">
          //   BlazeBites Admin
          // </span>
        )}
        {!isMobile && (
          <button
            onClick={() => setSidebarOpen((p) => !p)}
            className="ml-auto text-muted-foreground hover:text-foreground"
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        )}
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item) || (item.exact && isOverview);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => isMobile && setSidebarOpen(false)}
            >
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {(sidebarOpen || isMobile) && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-2 border-t border-border space-y-1 flex-shrink-0">
        <Link to="/" onClick={() => isMobile && setSidebarOpen(false)}>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer">
            <ExternalLink className="w-5 h-5 flex-shrink-0" />
            {(sidebarOpen || isMobile) && (
              <span className="font-medium text-sm">View Store</span>
            )}
          </div>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {(sidebarOpen || isMobile) && (
            <span className="font-medium text-sm">Logout</span>
          )}
        </button>
        {(sidebarOpen || isMobile) && currentUser && (
          <div className="px-3 py-2 mt-1">
            <p className="text-xs font-medium truncate">{currentUser.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {currentUser.email}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, currentUser } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (item) =>
    item.exact
      ? location.pathname === item.path
      : location.pathname.startsWith(item.path) && item.path !== "/admin";
  const isOverview = location.pathname === "/admin";
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const currentPage =
    navItems.find((i) => isActive(i) || (i.exact && isOverview))?.label ||
    "Admin";

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col flex-shrink-0 bg-card border-r border-border transition-all duration-300 fixed inset-y-0 left-0 z-40 ${sidebarOpen ? "w-60" : "w-16"}`}
      >
        <SidebarContent
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isActive={isActive}
          isOverview={isOverview}
          currentUser={currentUser}
          handleLogout={handleLogout}
          isMobile={false}
        />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-64 bg-card flex flex-col z-10">
            <SidebarContent
              sidebarOpen={true}
              setSidebarOpen={setMobileOpen}
              isActive={isActive}
              isOverview={isOverview}
              currentUser={currentUser}
              handleLogout={handleLogout}
              isMobile={true}
            />
          </aside>
        </div>
      )}

      {/* Main content */}
      <main
        className={`flex-1 min-h-screen lg:transition-all lg:duration-300 ${sidebarOpen ? "lg:ml-60" : "lg:ml-16"}`}
      >
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-30 h-14 bg-card border-b border-border flex items-center px-4 gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <span className="font-heading font-bold text-sm">{currentPage}</span>
        </div>

        <Outlet />
      </main>
    </div>
  );
}
