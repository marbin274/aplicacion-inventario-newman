import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { allowedUsers } from '../data/users.mock'

const LoginPage = () => {
  const { user, login, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    username: 'admin',
    password: 'admin123'
  })
  const [showPassword] = useState(false)
  const [error, setError] = useState('')

  if (user) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const success = await login(formData.username, formData.password)
    if (!success) {
      setError('Credenciales inválidas. Por favor verifica usuario y contraseña.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="login-page min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="login-form__container card max-w-md w-full m-4">
        <div className="card__header text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sistema de Inventario
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Inicia sesión para acceder al sistema
          </p>
        </div>
        
        <div className="card__content">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label htmlFor="username" className="form-group__label">
                Usuario
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                className="form-group__input"
                value={formData.username}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Introduce tu usuario"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-group__label">
                Contraseña
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                required
                className="form-group__input"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Introduce tu contraseña"
              />
            </div>

            {error && (
              <div className="error-message bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-2 rounded-md">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn--primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Iniciando sesión...
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          <div className="demo-credentials mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-400 mb-3">
              Cuentas de Demostración Disponibles:
            </h3>
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
              {
                allowedUsers.map(user => (
                  <div key={user.username} className="border-b border-blue-200 dark:border-blue-700 pb-2">
                    <strong>{user.role}:</strong> {user.username} / {user.password}
                    <br />
                    <span className="text-xs">{user.name}</span>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
