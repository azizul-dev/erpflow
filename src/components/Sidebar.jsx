import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  LayoutDashboard,
  Package,
  Users,
  Truck,
  ShoppingCart,
  TrendingUp,
  FileText,
  LogOut,
  X,
} from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar, isCollapsed, toggleCollapse }) => {
  const { logout, user } = useAuth();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Products", path: "/dashboard/products", icon: Package },
    { name: "Customers", path: "/dashboard/customers", icon: Users },
    { name: "Suppliers", path: "/dashboard/suppliers", icon: Truck },
    { name: "Purchases", path: "/dashboard/purchases", icon: ShoppingCart },
    { name: "Sales", path: "/dashboard/sales", icon: TrendingUp },
    { name: "Reports", path: "/dashboard/reports", icon: FileText },
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-card text-card-foreground transition-all duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "w-20" : "w-64"}
          lg:static lg:h-screen
        `}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg shadow-md shadow-primary/20">
              E
            </div>
            {!isCollapsed && (
              <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                ERPFlow
              </span>
            )}
          </div>
          {/* Close button for mobile */}
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-1.5 hover:bg-muted lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/dashboard"}
                onClick={() => {
                  // Auto close mobile sidebar on nav
                  if (isOpen) toggleSidebar();
                }}
                className={({ isActive }) => `
                  flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group
                  ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }
                `}
                title={isCollapsed ? item.name : ""}
              >
                <Icon
                  size={20}
                  className={`transition-transform duration-200 group-hover:scale-105`}
                />
                {!isCollapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer / User Profile & Logout */}
        <div className="border-t border-border p-4">
          {!isCollapsed && user && (
            <div className="mb-4 flex items-center gap-3 px-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground font-semibold border border-border">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium leading-none text-foreground">
                  {user.name}
                </p>
                <p className="truncate text-xs text-muted-foreground mt-1">
                  {user.role}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={logout}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors duration-200`}
            title={isCollapsed ? "Logout" : ""}
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
