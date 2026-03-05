import React from 'react';
import { useInventory, Product } from '../hooks/useInventory';
import { useDebounce } from '../hooks/useDebounce';
import SearchBar from '../components/SearchBar/SearchBar';
import Modal from '../components/Modal/Modal';
import ProductForm from '../components/Forms/ProductForm';
import { formatCurrency } from '../services';

const ProductsPage: React.FC = () => {
  const { state, addProduct, updateProduct, deleteProduct } = useInventory();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showModal, setShowModal] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [stockFilter, setStockFilter] = React.useState<string>('all');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredProducts = React.useMemo(() => {
    let filtered = state.products;
    
    if (debouncedSearchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        product.manufacturer.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }
    
    if (stockFilter !== 'all') {
      filtered = filtered.filter(product => {
        switch (stockFilter) {
          case 'sin-stock':
            return product.stock === 0;
          case 'stock-bajo':
            return product.stock > 0 && product.stock <= product.minStock;
          case 'en-stock':
            return product.stock > product.minStock;
          default:
            return true;
        }
      });
    }
    
    return filtered;
  }, [state.products, debouncedSearchTerm, stockFilter]);

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0) return { text: 'Sin stock', color: 'text-red-600 bg-red-50' };
    if (stock <= minStock) return { text: 'Stock bajo', color: 'text-yellow-600 bg-yellow-50' };
    return { text: 'En stock', color: 'text-green-600 bg-green-50' };
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      deleteProduct(id);
    }
  };

  const handleSubmitProduct = (productData: Omit<Product, 'id'>) => {
    if (editingProduct) {
      updateProduct({ ...editingProduct, ...productData });
    } else {
      addProduct(productData);
    }
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  return (
    <>
      <div className="products-page space-y-6">
        <div className="products-page__header flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gestión de Productos
            </h1>
            <p className="text-gray-600 mt-1">
              Total de productos: {state.products.length} | Mostrando: {filteredProducts.length}
            </p>
          </div>
          <button 
            onClick={handleAddProduct}
            className="btn btn--primary flex items-center gap-2 mt-4 sm:mt-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregar Producto
          </button>
        </div>

        <div className="products-page__filters flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar productos por nombre, categoría, fabricante o descripción..."
              className="w-full"
            />
          </div>
          <div className="sm:w-56">
            <select 
              value={stockFilter} 
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="all">Todos los Estados</option>
              <option value="sin-stock">Sin Stock</option>
              <option value="stock-bajo">Stock Bajo</option>
              <option value="en-stock">En Stock</option>
            </select>
          </div>
        </div>

        <div className="products-table card">
          <div className="card__content overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fabricante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <p className="text-lg font-medium text-gray-900 mb-1">
                          {searchTerm || stockFilter !== 'all' ? 'No se encontraron productos' : 'No hay productos registrados'}
                        </p>
                        <p className="text-gray-500">
                          {searchTerm || stockFilter !== 'all' ? 'Intenta ajustar los filtros de búsqueda' : 'Comienza agregando tu primer producto al inventario'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product.stock, product.minStock);
                    return (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {product.description && product.description.length > 50 
                                ? `${product.description.substring(0, 50)}...` 
                                : product.description || 'Sin descripción'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {product.manufacturer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          S/ {formatCurrency(product.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <span className="font-medium">{product.stock}</span>
                            <span className="text-gray-500 text-xs ml-1">/ {product.minStock} mín</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.color}`}>
                            {stockStatus.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              title="Editar producto"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Eliminar producto"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingProduct ? 'Editar Producto' : 'Agregar Producto'}
        size="md"
      >
        <ProductForm
          product={editingProduct}
          onSubmit={handleSubmitProduct}
          onCancel={handleCloseModal}
        />
      </Modal>
    </>
  );
};

export default ProductsPage;
