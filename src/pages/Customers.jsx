import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { customerService } from '../services/customerService.js';
import { TableSkeleton } from '../components/Skeleton.jsx';
import { toast } from 'sonner';
import { Plus, Search, Trash2, Users, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const Customers = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async (searchVal = '') => {
    setLoading(true);
    try {
      const data = await customerService.getAllCustomers(searchVal);
      setCustomers(data);
    } catch (error) {
      toast.error('Failed to load customers list');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCustomers(search);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleDelete = async (id, name) => {
    if (user?.role === 'User') {
      toast.error('Access Denied. You do not have permission to delete customers.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete customer "${name}"?`)) {
      try {
        await customerService.deleteCustomer(id);
        toast.success('Customer removed successfully');
        setCustomers(customers.filter((c) => c._id !== id));
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete customer');
        console.error(error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card p-4 rounded-2xl border border-border shadow-sm">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search customers by name, email, phone or company..."
            className="w-full rounded-xl border border-input bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        {user?.role !== 'User' && (
          <Link
            to="/dashboard/customers/add"
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/10 hover:bg-primary/95 transition-all duration-200"
          >
            <Plus size={18} />
            Add Customer
          </Link>
        )}
      </div>

      {/* Customers Table Wrapper */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={5} cols={6} />
          </div>
        ) : customers.length > 0 ? (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-medium">
                <tr>
                  <th className="px-6 py-4">Customer Name</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Address</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {customers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-muted/20 transition-colors duration-150">
                    <td className="px-6 py-4 font-semibold text-foreground">
                      {customer.name}
                    </td>
                    <td className="px-6 py-4 text-foreground">
                      {customer.company || <span className="text-muted-foreground italic">N/A</span>}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {customer.phone}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-mono text-xs">
                      {customer.email || <span className="text-muted-foreground italic">N/A</span>}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground truncate max-w-xs">
                      {customer.address || <span className="text-muted-foreground italic">N/A</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user?.role !== 'User' ? (
                        <button
                          onClick={() => handleDelete(customer._id, customer.name)}
                          className="rounded-lg p-2 text-muted-foreground hover:bg-red-50 hover:text-destructive transition-all duration-150"
                          title="Delete customer"
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground italic px-2">Read-only</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
              <Users size={24} />
            </div>
            <h3 className="text-base font-semibold text-foreground">No Customers Found</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Try creating a new customer account or adjusting your search queries.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customers;
