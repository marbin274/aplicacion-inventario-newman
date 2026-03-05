import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const Layout = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'Productos', href: '/products' },
    { name: 'Proveedores', href: '/suppliers' },
    { name: 'Pedidos a Proveedores', href: '/orders' },
    { name: 'Pedidos de Clientes', href: '/customer-orders' },
  ]

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="sidebar sidebar--main fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="sidebar__header flex h-16 items-center justify-center border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Sistema de Inventario
          </h1>
        </div>
        
        <nav className="sidebar__nav mt-8 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`nav-item nav-item--sidebar flex items-center px-4 py-2 text-sm rounded-md transition-colors ${
                      isActive
                        ? 'nav-item--active bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      <div className="main-content ml-64">
        <header className="header header--main bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="header__content flex h-16 items-center justify-between px-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Bienvenido, {user?.username}
            </h2>
            
            <button
              onClick={logout}
              className="btn btn--secondary flex items-center space-x-2"
            >
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </header>

        <main className="main main--content p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
