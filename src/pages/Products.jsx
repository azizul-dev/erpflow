import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService.js';
import { TableSkeleton } from '../components/Skeleton.jsx';
import { toast } from 'sonner';
import { Plus, Search, Edit, Trash2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const Products = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProducts = async (searchVal = '') => {
    setLoading(true);
    try {
      const data = await productService.getAllProducts(searchVal);
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load products list');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Implement debounce for search input
    const delayDebounceFn = setTimeout(() => {
      fetchProducts(search);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleDelete = async (id, name) => {
    if (user?.role === 'User') {
      toast.error('Access Denied. You do not have permission to delete products.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete product "${name}"?`)) {
      try {
        await productService.deleteProduct(id);
        toast.success('Product deleted successfully');
        setProducts(products.filter((p) => p._id !== id));
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete product');
        console.error(error);
      }
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val);
  };

  const getStockBadge = (stock) => {
    if (stock === 0) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 border border-red-200">
          Out of Stock
        </span>
      );
    }
    if (stock <= 10) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
          Low Stock ({stock})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
        In Stock ({stock})
      </span>
    );
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
            placeholder="Search products by name, SKU or category..."
            className="w-full rounded-xl border border-input bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        {user?.role !== 'User' && (
          <Link
            to="/dashboard/products/add"
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/10 hover:bg-primary/95 transition-all duration-200"
          >
            <Plus size={18} />
            Add Product
          </Link>
        )}
      </div>

      {/* Products Table Wrapper */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={5} cols={7} />
          </div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-medium">
                <tr>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Selling Price</th>
                  <th className="px-6 py-4">Cost Price</th>
                  <th className="px-6 py-4">Inventory</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-muted/20 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">{product.name}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-xs">{product.description || 'No description'}</div>
                    </td>
                    <td className="px-6 py-4 font-mono font-medium text-xs text-foreground uppercase">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-6 py-4 font-medium text-muted-foreground">
                      {formatCurrency(product.cost)}
                    </td>
                    <td className="px-6 py-4">
                      {getStockBadge(product.stock)}
                      <span className="text-xs text-muted-foreground ml-1">({product.unit})</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {user?.role !== 'User' ? (
                          <>
                            <button
                              onClick={() => navigate(`/dashboard/products/edit/${product._id}`)}
                              className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-150"
                              title="Edit product"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(product._id, product.name)}
                              className="rounded-lg p-2 text-muted-foreground hover:bg-red-50 hover:text-destructive transition-all duration-150"
                              title="Delete product"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground italic px-2">Read-only</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
              <ShieldAlert size={24} />
            </div>
            <h3 className="text-base font-semibold text-foreground">No Products Found</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              We couldn't find any products in your inventory. Try adding one or adjusting your search parameters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
