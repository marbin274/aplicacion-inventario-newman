import { useInventory } from '../hooks/useInventory'
import { formatCurrency } from '../services'

const Dashboard = () => {
  const { state } = useInventory()

  // Calculate statistics
  const totalProducts = state.products.length
  const totalSuppliers = state.suppliers.length
  const totalValue = state.products.reduce((sum, product) => sum + (product.price * product.stock), 0)
  const lowStockProducts = state.products.filter(product => product.stock <= product.minStock)
  const totalSupplierOrders = state.supplierOrders.length
  const totalCustomerOrders = state.customerOrders.length
  const pendingOrders = state.customerOrders.filter(order => order.status === 'pending').length
  const monthlyRevenue = state.customerOrders
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) => sum + order.total, 0)

 

  return (
    <div className="dashboard space-y-6">
      <div className="dashboard__header">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Panel de Control
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Resumen general del inventario
        </p>
      </div>


      <div className="dashboard__stats grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card card">
          <div className="card__content flex items-center">
            <div className="stat-card__icon w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="stat-card__info ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Productos
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalProducts}
              </p>
            </div>
          </div>
        </div>

        <div className="stat-card card">
          <div className="card__content flex items-center">
            <div className="stat-card__icon w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="stat-card__info ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Proveedores
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalSuppliers}
              </p>
            </div>
          </div>
        </div>

        <div className="stat-card card">
          <div className="card__content flex items-center">
            <div className="stat-card__icon w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="stat-card__info ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Valor Total Inventario
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totalValue)}
              </p>
            </div>
          </div>
        </div>

        <div className="stat-card card">
          <div className="card__content flex items-center">
            <div className="stat-card__icon w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="stat-card__info ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Productos Bajo Stock
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {lowStockProducts.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard__stats-secondary grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat-card card">
          <div className="card__content flex items-center">
            <div className="stat-card__icon w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div className="stat-card__info ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Órdenes de Proveedores
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalSupplierOrders}
              </p>
              <p className="text-xs text-gray-500">
                Gestión de compras
              </p>
            </div>
          </div>
        </div>

        <div className="stat-card card">
          <div className="card__content flex items-center">
            <div className="stat-card__icon w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="stat-card__info ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Órdenes de Clientes
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalCustomerOrders}
              </p>
              <p className="text-xs text-gray-500">
                {pendingOrders} pendientes
              </p>
            </div>
          </div>
        </div>

        <div className="stat-card card">
          <div className="card__content flex items-center">
            <div className="stat-card__icon w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="stat-card__info ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Ingresos del Mes
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(monthlyRevenue)}
              </p>
              <p className="text-xs text-gray-500">
                Órdenes entregadas
              </p>
            </div>
          </div>
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="dashboard__alerts">
          <div className="alert alert--warning card">
            <div className="card__header">
              <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-400">
                Productos con Bajo Stock
              </h3>
            </div>
            <div className="card__content">
              <div className="space-y-2">
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="low-stock-item flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-md">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Stock: {product.stock} | Mínimo: {product.minStock}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                      ¡Reabastecer!
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard__recent">
        <div className="recent-products card">
          <div className="card__header">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Productos Recientes
            </h3>
          </div>
          <div className="card__content">
            {state.products.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No hay productos registrados
              </p>
            ) : (
              <div className="space-y-3">
                {state.products.slice(0, 5).map((product) => (
                  <div key={product.id} className="recent-product flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {product.category} - {product.manufacturer}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(product.price)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Stock: {product.stock}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
