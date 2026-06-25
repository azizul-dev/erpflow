import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";

// Auth Pages
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

// Dashboard
import Dashboard from "./pages/Dashboard.jsx";

// Products
import Products from "./pages/Products.jsx";
import AddProduct from "./pages/AddProduct.jsx";
import EditProduct from "./pages/EditProduct.jsx";

// Customers
import Customers from "./pages/Customers.jsx";
import AddCustomer from "./pages/AddCustomer.jsx";

// Suppliers
import SupplierList from "./pages/suppliers/SupplierList.jsx";
import SupplierAdd from "./pages/suppliers/SupplierAdd.jsx";
import SupplierEdit from "./pages/suppliers/SupplierEdit.jsx";

// Purchases
import PurchaseList from "./pages/purchases/PurchaseList.jsx";
import PurchaseAdd from "./pages/purchases/PurchaseAdd.jsx";

// Sales
import SaleList from "./pages/sales/SaleList.jsx";
import SaleAdd from "./pages/sales/SaleAdd.jsx";

// Reports & 404
import Reports from "./pages/Reports.jsx";
import NotFound from "./pages/NotFound.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <Toaster position="top-right" richColors expand closeButton />
          <Routes>
            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Auth routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />

            {/* Protected dashboard routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/products" element={<Products />} />
                <Route
                  path="/dashboard/products/add"
                  element={<AddProduct />}
                />
                <Route
                  path="/dashboard/products/edit/:id"
                  element={<EditProduct />}
                />
                <Route path="/dashboard/customers" element={<Customers />} />
                <Route
                  path="/dashboard/customers/add"
                  element={<AddCustomer />}
                />
                <Route path="/dashboard/suppliers" element={<SupplierList />} />
                <Route
                  path="/dashboard/suppliers/add"
                  element={<SupplierAdd />}
                />
                <Route
                  path="/dashboard/suppliers/edit/:id"
                  element={<SupplierEdit />}
                />
                <Route path="/dashboard/purchases" element={<PurchaseList />} />
                <Route
                  path="/dashboard/purchases/add"
                  element={<PurchaseAdd />}
                />
                <Route path="/dashboard/sales" element={<SaleList />} />
                <Route path="/dashboard/sales/add" element={<SaleAdd />} />
                <Route path="/dashboard/reports" element={<Reports />} />
              </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;
