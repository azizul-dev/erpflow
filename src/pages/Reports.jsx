import { useState, useEffect, useMemo } from 'react';
import { reportService } from '../services/reportService';
import productService from '../services/productService';
import customerService from '../services/customerService';
import supplierService from '../services/supplierService';
import purchaseService from '../services/purchaseService';
import salesService from '../services/salesService';
import Loader from '../components/Loader';
import { toast } from 'sonner';
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

const TABS = ['Products', 'Customers', 'Suppliers', 'Purchases', 'Sales'];
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

const SortIcon = ({ column, sortConfig }) => {
  if (sortConfig.key !== column) return <ChevronsUpDown className="w-3 h-3 inline ml-1 text-gray-400" />;
  return sortConfig.direction === 'asc'
    ? <ChevronUp className="w-3 h-3 inline ml-1 text-blue-500" />
    : <ChevronDown className="w-3 h-3 inline ml-1 text-blue-500" />;
};

const TableHeader = ({ label, column, sortConfig, onSort }) => (
  <th
    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-blue-600 select-none"
    onClick={() => onSort(column)}
  >
    {label}
    <SortIcon column={column} sortConfig={sortConfig} />
  </th>
);

const Reports = () => {
  const [activeTab, setActiveTab] = useState('Products');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchData = async (tab) => {
    setLoading(true);
    setSearch('');
    setSortConfig({ key: null, direction: 'asc' });
    setCurrentPage(1);
    try {
      let result = [];
      switch (tab) {
        case 'Products':   result = await productService.getAllProducts(); break;
        case 'Customers':  result = await customerService.getAllCustomers(); break;
        case 'Suppliers':  result = await supplierService.getAllSuppliers(); break;
        case 'Purchases':  result = await purchaseService.getPurchases(); break;
        case 'Sales':      result = await salesService.getSales(); break;
        default: break;
      }
      setData(Array.isArray(result) ? result : []);
    } catch (error) {
      toast.error(`Failed to load ${tab} report`);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const handleSort = (key) => {
    setSortConfig(prev =>
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' }
    );
    setCurrentPage(1);
  };

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const s = search.toLowerCase();
    return data.filter(row =>
      Object.values(row).some(val =>
        String(val?.name || val || '').toLowerCase().includes(s)
      )
    );
  }, [data, search]);

  const sorted = useMemo(() => {
    if (!sortConfig.key) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = String(getNestedValue(a, sortConfig.key) ?? '');
      const bVal = String(getNestedValue(b, sortConfig.key) ?? '');
      const cmp = aVal.localeCompare(bVal, undefined, { numeric: true });
      return sortConfig.direction === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const renderColumns = () => {
    switch (activeTab) {
      case 'Products':
        return (
          <>
            <TableHeader label="Name" column="name" sortConfig={sortConfig} onSort={handleSort} />
            <TableHeader label="Category" column="category" sortConfig={sortConfig} onSort={handleSort} />
            <TableHeader label="Price" column="price" sortConfig={sortConfig} onSort={handleSort} />
            <TableHeader label="Stock" column="stock" sortConfig={sortConfig} onSort={handleSort} />
          </>
        );
      case 'Customers':
        return (
          <>
            <TableHeader label="Name" column="name" sortConfig={sortConfig} onSort={handleSort} />
            <TableHeader label="Email" column="email" sortConfig={sortConfig} onSort={handleSort} />
            <TableHeader label="Phone" column="phone" sortConfig={sortConfig} onSort={handleSort} />
          </>
        );
      case 'Suppliers':
        return (
          <>
            <TableHeader label="Name" column="name" sortConfig={sortConfig} onSort={handleSort} />
            <TableHeader label="Email" column="email" sortConfig={sortConfig} onSort={handleSort} />
            <TableHeader label="Phone" column="phone" sortConfig={sortConfig} onSort={handleSort} />
            <TableHeader label="Address" column="address" sortConfig={sortConfig} onSort={handleSort} />
          </>
        );
      case 'Purchases':
        return (
          <>
            <TableHeader label="Date" column="purchaseDate" sortConfig={sortConfig} onSort={handleSort} />
            <TableHeader label="Supplier" column="supplier.name" sortConfig={sortConfig} onSort={handleSort} />
            <TableHeader label="Total" column="totalAmount" sortConfig={sortConfig} onSort={handleSort} />
            <TableHeader label="Status" column="status" sortConfig={sortConfig} onSort={handleSort} />
          </>
        );
      case 'Sales':
        return (
          <>
            <TableHeader label="Date" column="saleDate" sortConfig={sortConfig} onSort={handleSort} />
            <TableHeader label="Customer" column="customer.name" sortConfig={sortConfig} onSort={handleSort} />
            <TableHeader label="Total" column="totalAmount" sortConfig={sortConfig} onSort={handleSort} />
            <TableHeader label="Status" column="status" sortConfig={sortConfig} onSort={handleSort} />
          </>
        );
      default: return null;
    }
  };

  const renderRow = (row, index) => {
    switch (activeTab) {
      case 'Products':
        return (
          <tr key={row._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
            <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.name}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{row.category || '—'}</td>
            <td className="px-4 py-3 text-sm text-gray-700">${Number(row.price).toFixed(2)}</td>
            <td className="px-4 py-3 text-sm">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                row.stock > 10 ? 'bg-green-100 text-green-700' :
                row.stock > 0  ? 'bg-yellow-100 text-yellow-700' :
                                 'bg-red-100 text-red-700'
              }`}>{row.stock}</span>
            </td>
          </tr>
        );
      case 'Customers':
        return (
          <tr key={row._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
            <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.name}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{row.email || '—'}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{row.phone || '—'}</td>
          </tr>
        );
      case 'Suppliers':
        return (
          <tr key={row._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
            <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.name}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{row.email || '—'}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{row.phone || '—'}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{row.address || '—'}</td>
          </tr>
        );
      case 'Purchases':
        return (
          <tr key={row._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
            <td className="px-4 py-3 text-sm text-gray-700">{new Date(row.purchaseDate).toLocaleDateString()}</td>
            <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.supplier?.name || '—'}</td>
            <td className="px-4 py-3 text-sm text-gray-700">${Number(row.totalAmount).toFixed(2)}</td>
            <td className="px-4 py-3 text-sm">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                row.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>{row.status}</span>
            </td>
          </tr>
        );
      case 'Sales':
        return (
          <tr key={row._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
            <td className="px-4 py-3 text-sm text-gray-700">{new Date(row.saleDate).toLocaleDateString()}</td>
            <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.customer?.name || '—'}</td>
            <td className="px-4 py-3 text-sm text-gray-700">${Number(row.totalAmount).toFixed(2)}</td>
            <td className="px-4 py-3 text-sm">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                row.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>{row.status}</span>
            </td>
          </tr>
        );
      default: return null;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Reports</h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab.toLowerCase()}...`}
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {PAGE_SIZE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-12 text-center"><Loader /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>{renderColumns()}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.length > 0
                  ? paginated.map((row, idx) => renderRow(row, idx))
                  : (
                    <tr>
                      <td colSpan="6" className="px-4 py-10 text-center text-sm text-gray-400">
                        {search ? 'No results match your search.' : `No ${activeTab.toLowerCase()} records found.`}
                      </td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && sorted.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
          <p className="text-sm text-gray-500">
            Showing {Math.min((currentPage - 1) * pageSize + 1, sorted.length)}–{Math.min(currentPage * pageSize, sorted.length)} of {sorted.length} records
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-2 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >«</button>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
              const page = start + i;
              if (page > totalPages) return null;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 text-sm border rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >{page}</button>
              );
            })}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >»</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
