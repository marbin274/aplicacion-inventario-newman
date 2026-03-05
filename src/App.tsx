import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import { InventoryProvider } from './hooks/useInventory'
import Layout from './components/Layout/Layout'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import ProductsPage from './pages/ProductsPage'
import SuppliersPage from './pages/SuppliersPage'
import OrdersPage from './pages/OrdersPage'
import CustomerOrdersPage from './pages/CustomerOrdersPage'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <InventoryProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="suppliers" element={<SuppliersPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="customer-orders" element={<CustomerOrdersPage />} />
            </Route>
          </Routes>
        </Router>
      </InventoryProvider>
    </AuthProvider>
  )
}

export default App
