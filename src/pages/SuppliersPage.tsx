import React from 'react';
import { useInventory } from '../hooks/useInventory'
import { useDebounce } from '../hooks/useDebounce'
import SearchBar from '../components/SearchBar/SearchBar'
import Modal from '../components/Modal/Modal'
import SupplierForm from '../components/Forms/SupplierForm'

const SuppliersPage: React.FC = () => {
  const { state, addSupplier, updateSupplier, deleteSupplier } = useInventory()
  const [searchTerm, setSearchTerm] = React.useState('')
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingSupplier, setEditingSupplier] = React.useState<any>(null)
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const filteredSuppliers = React.useMemo(() => {
    if (!debouncedSearchTerm) return state.suppliers
    
    return state.suppliers.filter(supplier =>
      supplier.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      supplier.contact.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    )
  }, [state.suppliers, debouncedSearchTerm])

  const handleOpenModal = () => {
    setEditingSupplier(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingSupplier(null)
  }

  const handleEditSupplier = (supplier: any) => {
    setEditingSupplier(supplier)
    setIsModalOpen(true)
  }

  const handleDeleteSupplier = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
      deleteSupplier(id)
    }
  }

  const handleFormSubmit = async (supplierData: any) => {
    try {
      if (editingSupplier) {
        await updateSupplier({
          ...editingSupplier,
          ...supplierData
        });
      } else {
        await addSupplier(supplierData)
      }
      
      setIsModalOpen(false)
      setEditingSupplier(null)
    } catch (error) {
      console.error('Error al guardar proveedor:', error)
    }
  }

  return (
    <div className="suppliers-page space-y-6">
      <div className="suppliers-page__header flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Proveedores
          </h1>
          <p className="text-gray-600 mt-1">
            Total de proveedores: {state.suppliers.length}
          </p>
        </div>
        <button 
          onClick={handleOpenModal}
          className="btn btn--primary flex items-center gap-2 mt-4 sm:mt-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Agregar Proveedor
        </button>
      </div>

      <div className="suppliers-page__search">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar proveedores por nombre, contacto o email..."
          className="max-w-md"
        />
      </div>

      <div className="suppliers-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSuppliers.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="flex flex-col items-center">
              <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No se encontraron proveedores' : 'No hay proveedores registrados'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza agregando tu primer proveedor'}
              </p>
              {!searchTerm && (
                <button 
                  onClick={handleOpenModal}
                  className="btn btn--primary"
                >
                  Agregar Proveedor
                </button>
              )}
            </div>
          </div>
        ) : (
          filteredSuppliers.map((supplier) => (
            <div key={supplier.id} className="supplier-card card dark:bg-white hover:shadow-lg transition-shadow">
              <div className="card__content">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 truncate pr-2">
                    {supplier.name}
                  </h3>
                  <div className="flex gap-1 ml-2">
                    <button 
                      onClick={() => handleEditSupplier(supplier)}
                      className="text-blue-600 hover:text-blue-800 p-1" 
                      title="Editar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDeleteSupplier(supplier.id)}
                      className="text-red-600 hover:text-red-800 p-1" 
                      title="Eliminar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium mr-1">Contacto:</span>
                    {supplier.contact}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="truncate">{supplier.email}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {supplier.phone}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>ID: {supplier.id}</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      Activo
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingSupplier ? 'Editar Proveedor' : 'Agregar Nuevo Proveedor'}
        size="md"
      >
        <SupplierForm
          supplier={editingSupplier}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  )
}

export default SuppliersPage
