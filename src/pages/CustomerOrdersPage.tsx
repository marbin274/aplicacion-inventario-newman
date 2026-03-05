import React from 'react';
import { CustomerOrder, useInventory } from '../hooks/useInventory';
import { useDebounce } from '../hooks/useDebounce';
import SearchBar from '../components/SearchBar/SearchBar';
import Modal from '../components/Modal/Modal';
import CustomerOrderForm from '../components/Forms/CustomerOrderForm';
import { formatCurrency, printOrder } from '../services';

const CustomerOrdersPage: React.FC = () => {
  const { state, addCustomerOrder, updateCustomerOrder } = useInventory();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingOrder, setEditingOrder] = React.useState<any>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredOrders = React.useMemo(() => {
    let filtered = state.customerOrders;

    if (debouncedSearchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    return filtered;
  }, [state.customerOrders, debouncedSearchTerm, statusFilter]);


  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pendiente' },
      processing: { color: 'bg-blue-100 text-blue-800', text: 'Procesando' },
      shipped: { color: 'bg-purple-100 text-purple-800', text: 'Enviado' },
      delivered: { color: 'bg-green-100 text-green-800', text: 'Entregado' },
      cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelado' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleOpenModal = () => {
    setEditingOrder(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOrder(null);
  };

  const handleUpdateOrderStatus = (order: any, newStatus: string) => {
    const updatedOrder = { ...order, status: newStatus };
    
    if (newStatus === 'shipped' && !order.shippedDate) {
      updatedOrder.shippedDate = new Date().toISOString().split('T')[0];
    } else if (newStatus === 'delivered' && !order.deliveredDate) {
      updatedOrder.deliveredDate = new Date().toISOString().split('T')[0];
    }
    
    updateCustomerOrder(updatedOrder);
  };

  const handlePrintOrder = (order: CustomerOrder) => {
    const productsFinded = order.products
      .map(orderProduct => {
        const stateProduct = state.products.find(product => product.id === orderProduct.productId);
        if (stateProduct) {
          return {
            ...orderProduct,
            ...stateProduct
          };
        }
        return null;
      })
      .filter((product): product is NonNullable<typeof product> => product !== null);
    
    printOrder(order, productsFinded);
  };

  const handleEditOrder = (order: CustomerOrder) => {
    setEditingOrder(order);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (orderData: Omit<CustomerOrder, 'id' | 'status' | 'orderDate'>) => {
    try {
      if (editingOrder) {
        await updateCustomerOrder({
          ...editingOrder,
          ...orderData
        });
      } else {
        const newOrder = {
          ...orderData,
          status: 'pending' as const,
          orderDate: new Date().toISOString().split('T')[0]
        };
        await addCustomerOrder(newOrder);
      }
      
      setIsModalOpen(false);
      setEditingOrder(null);
    } catch (error) {
      console.error('Error al guardar pedido:', error);
    }
  };

  return (
    <div className="customer-orders-page space-y-6">
      <div className="customer-orders-page__header flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Pedidos de Clientes
          </h1>
          <p className="text-gray-600 mt-1">
            Total de órdenes: {state.customerOrders.length} | Mostrando: {filteredOrders.length}
          </p>
        </div>
        <button 
          onClick={handleOpenModal}
          className="btn btn--primary flex items-center gap-2 mt-4 sm:mt-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Pedido
        </button>
      </div>

      <div className="customer-orders-page__filters flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por ID, cliente o email..."
            className="w-full"
          />
        </div>
        <div className="sm:w-48">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="all">Todos los Estados</option>
            <option value="pending">Pendientes</option>
            <option value="processing">Procesando</option>
            <option value="shipped">Enviados</option>
            <option value="delivered">Entregados</option>
            <option value="cancelled">Cancelados</option>
          </select>
        </div>
      </div>

      <div className="customer-orders-table card">
        <div className="card__content overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Pedido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Productos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Pedido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Método Pago
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
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
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <p className="text-lg font-medium text-gray-900 mb-1">
                        {searchTerm || statusFilter !== 'all' ? 'No se encontraron órdenes' : 'No hay pedidos registrados'}
                      </p>
                      <p className="text-gray-500">
                        {searchTerm || statusFilter !== 'all' ? 'Intenta ajustar los filtros de búsqueda' : 'Las órdenes de clientes aparecerán aquí'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono font-medium text-gray-900">
                        {order.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.customerName}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {order.customerEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.products.length} producto{order.products.length !== 1 ? 's' : ''}
                      </div>
                      <div className="text-xs text-gray-500 max-w-xs">
                        Total: {order.products.reduce((sum, p) => sum + p.quantity, 0)} unidades
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(order.orderDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.paymentMethod}
                      </div>
                      <div className="text-xs text-gray-500">
                        Envío: {formatCurrency(order.shippingCost)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(order.total + order.shippingCost)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Base: {formatCurrency(order.total)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditOrder(order)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Editar pedido"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            // Cycle through: pending -> processing -> shipped -> delivered
                            const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
                            const currentIndex = statusOrder.indexOf(order.status);
                            const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
                            handleUpdateOrderStatus(order, nextStatus);
                          }}
                          className="text-green-600 hover:text-green-800 transition-colors"
                          title="Cambiar estado"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handlePrintOrder(order)}
                          className="text-purple-600 hover:text-purple-800 transition-colors"
                          title="Imprimir"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingOrder ? 'Editar Pedido de Cliente' : 'Crear Nuevo Pedido de Cliente'}
        size="lg"
      >
        <CustomerOrderForm
          order={editingOrder}
          products={state.products}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default CustomerOrdersPage;
