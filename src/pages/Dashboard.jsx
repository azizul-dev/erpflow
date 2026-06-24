import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService.js';
import { CardSkeleton, Skeleton } from '../components/Skeleton.jsx';
import { toast } from 'sonner';
import {
  Package,
  Users,
  Truck,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardService.getDashboardStats();
        setStats(data);
      } catch (error) {
        toast.error('Failed to load dashboard statistics');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        {/* KPI Skeletons */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <CardSkeleton key={idx} />
          ))}
        </div>
        
        {/* Chart Skeletons */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <Skeleton className="h-6 w-1/3 mb-6" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <Skeleton className="h-6 w-1/3 mb-6" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const kpis = stats?.kpis || {
    totalProducts: 0,
    totalCustomers: 0,
    totalSuppliers: 0,
    totalPurchases: 0,
    totalSales: 0,
    totalRevenue: 0,
  };

  const monthlyData = stats?.monthlyChartData || [];
  const topProductsData = stats?.topProductsChartData || [];

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(kpis.totalRevenue),
      icon: DollarSign,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      description: 'Accumulated invoice totals',
    },
    {
      title: 'Sales Orders',
      value: kpis.totalSales,
      icon: TrendingUp,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      description: 'Total invoices generated',
    },
    {
      title: 'Purchase Bills',
      value: kpis.totalPurchases,
      icon: ShoppingCart,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      description: 'Incoming procurement bills',
    },
    {
      title: 'Products in Catalog',
      value: kpis.totalProducts,
      icon: Package,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
      description: 'Unique items registered',
    },
    {
      title: 'Customers',
      value: kpis.totalCustomers,
      icon: Users,
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
      description: 'Registered buyers list',
    },
    {
      title: 'Suppliers',
      value: kpis.totalSuppliers,
      icon: Truck,
      color: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
      description: 'Linked shipping vendors',
    },
  ];

  // Colors for Top Products Bar Chart
  const BAR_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

  return (
    <div className="space-y-8">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpiCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  {card.title}
                </span>
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg border ${card.color}`}>
                  <Icon size={16} />
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-foreground">
                  {card.value}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground line-clamp-1">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Monthly Revenue & Purchase Costs Chart */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-base font-semibold leading-6 text-foreground">
              Procurement & Sales Performance
            </h3>
            <p className="text-xs text-muted-foreground">
              Compare invoice revenue against purchases costs (last 6 months)
            </p>
          </div>
          <div className="h-72 w-full">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '0.75rem',
                      color: 'hsl(var(--foreground))',
                      fontSize: '12px',
                    }}
                    formatter={(value) => [`$${value}`, '']}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                  <Area
                    name="Sales Revenue"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                  <Area
                    name="Purchase Costs"
                    type="monotone"
                    dataKey="cost"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCost)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No performance data available
              </div>
            )}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-base font-semibold leading-6 text-foreground">
              Top Products by Units Sold
            </h3>
            <p className="text-xs text-muted-foreground">
              Identify top 5 selling catalog entries
            </p>
          </div>
          <div className="h-72 w-full">
            {topProductsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProductsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="sku" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '0.75rem',
                      color: 'hsl(var(--foreground))',
                      fontSize: '12px',
                    }}
                    formatter={(value, name, props) => [
                      `${value} pcs (Rev: ${formatCurrency(props.payload.revenue)})`,
                      'Quantity Sold'
                    ]}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                  <Bar name="Quantity Sold" dataKey="quantity" radius={[4, 4, 0, 0]}>
                    {topProductsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No sales volume data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
