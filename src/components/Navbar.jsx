import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Menu, ChevronLeft, ChevronRight, Bell, User } from 'lucide-react';

const Navbar = ({ toggleSidebar, isCollapsed, toggleCollapse }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Determine current page title based on pathname
  const getPageTitle = (pathname) => {
    if (pathname === '/dashboard') return 'Dashboard Overview';
    if (pathname.includes('/products/add')) return 'Add Product';
    if (pathname.includes('/products/edit')) return 'Edit Product';
    if (pathname.includes('/products')) return 'Inventory Products';
    if (pathname.includes('/customers/add')) return 'Add Customer';
    if (pathname.includes('/customers')) return 'Customers List';
    if (pathname.includes('/suppliers/add')) return 'Add Supplier';
    if (pathname.includes('/suppliers')) return 'Suppliers List';
    if (pathname.includes('/purchases/add')) return 'Add Purchase';
    if (pathname.includes('/purchases')) return 'Purchase Records';
    if (pathname.includes('/sales/add')) return 'Record Sale';
    if (pathname.includes('/sales')) return 'Sales Records';
    if (pathname.includes('/reports')) return 'Analytics Reports';
    return 'ERPFlow';
  };

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-border bg-card px-6 shadow-sm">
      {/* Left side actions */}
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger menu */}
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground lg:hidden"
          aria-label="Toggle mobile menu"
        >
          <Menu size={22} />
        </button>

        {/* Desktop Sidebar Collapse Toggle */}
        <button
          onClick={toggleCollapse}
          className="hidden rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground lg:block"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        <h1 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
          {getPageTitle(location.pathname)}
        </h1>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4">
        {/* Notifications Icon (Visual Polish) */}
        <button
          className="relative rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
          aria-label="View notifications"
        >
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
        </button>

        {/* User profile section */}
        {user && (
          <div className="flex items-center gap-3 border-l border-border pl-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold border border-primary/20">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium leading-none text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground mt-1 capitalize">{user.role.toLowerCase()}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
