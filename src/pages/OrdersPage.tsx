
import React from 'react';
import { useInventory } from '../hooks/useInventory';
import { useDebounce } from '../hooks/useDebounce';
import SearchBar from '../components/SearchBar/SearchBar';
import Modal from '../components/Modal/Modal';
import SupplierOrderForm from '../components/Forms/SupplierOrderForm';
import { formatCurrency } from '../services';

const OrdersPage: React.FC = () => {
  const { state, addSupplierOrder, updateSupplierOrder } = useInventory();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingOrder, setEditingOrder] = React.useState<any>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredOrders = React.useMemo(() => {
    let filtered = state.supplierOrders;

    if (debouncedSearchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        state.suppliers.find(s => s.id === order.supplierId)?.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    return filtered;
  }, [state.supplierOrders, state.suppliers, debouncedSearchTerm, statusFilter]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pendiente' },
      approved: { color: 'bg-blue-100 text-blue-800', text: 'Aprobado' },
      received: { color: 'bg-green-100 text-green-800', text: 'Recibido' },
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

  const getSupplierName = (supplierId: string) => {
    const supplier = state.suppliers.find(s => s.id === supplierId);
    return supplier?.name || 'Proveedor Desconocido';
  };

  const handleOpenModal = () => {
    setEditingOrder(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOrder(null);
  };

  const handleEditOrder = (order: any) => {
    setEditingOrder(order);
    setIsModalOpen(true);
  };

  const handleUpdateOrderStatus = (order: any, newStatus: string) => {
    updateSupplierOrder({
      ...order,
      status: newStatus
    });
  };

  const handleFormSubmit = async (orderData: any) => {
    try {
      if (editingOrder) {
        await updateSupplierOrder({
          ...editingOrder,
          ...orderData
        });
      } else {
        await addSupplierOrder(orderData);
      }
      
      setIsModalOpen(false);
      setEditingOrder(null);
    } catch (error) {
      console.error('Error al guardar pedido:', error);
    }
  };

  return (
    <div className="orders-page space-y-6">
      <div className="orders-page__header flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Pedidos a Proveedores
          </h1>
          <p className="text-gray-600 mt-1">
            Total de órdenes: {state.supplierOrders.length} | Mostrando: {filteredOrders.length}
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

      <div className="orders-page__filters flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por ID de orden o nombre de proveedor..."
            className="w-full"
          />
        </div>
        <div className="sm:w-48">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-group__input"
          >
            <option value="all">Todos los Estados</option>
            <option value="pending">Pendientes</option>
            <option value="approved">Aprobados</option>
            <option value="received">Recibidos</option>
            <option value="cancelled">Cancelados</option>
          </select>
        </div>
      </div>

      <div className="orders-table card">
        <div className="card__content overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Pedido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proveedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Productos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Pedido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entrega Est.
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      <p className="text-lg font-medium text-gray-900 mb-1">
                        {searchTerm || statusFilter !== 'all' ? 'No se encontraron órdenes' : 'No hay pedidos registrados'}
                      </p>
                      <p className="text-gray-500">
                        {searchTerm || statusFilter !== 'all' ? 'Intenta ajustar los filtros de búsqueda' : 'Crea tu primera orden de compra'}
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
                      <div className="text-sm font-medium text-gray-900">
                        {getSupplierName(order.supplierId)}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {order.supplierId}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.products.length} producto{order.products.length !== 1 ? 's' : ''}
                      </div>
                      <div className="text-xs text-gray-500 max-w-xs truncate">
                        {order.products.map(p => `${p.quantity} unidades`).join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(order.orderDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(order.estimatedDelivery)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(order.total)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            // Toggle between pending -> approved -> received
                            const nextStatus = order.status === 'pending' ? 'approved' : 
                                             order.status === 'approved' ? 'received' : 'pending';
                            handleUpdateOrderStatus(order, nextStatus);
                          }}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Cambiar estado"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEditOrder(order)}
                          className="text-green-600 hover:text-green-800 transition-colors"
                          title="Editar orden"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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
        title={editingOrder ? 'Editar Pedido a Proveedor' : 'Crear Nuevo Pedido a Proveedor'}
        size="lg"
      >
        <SupplierOrderForm
          order={editingOrder}
          suppliers={state.suppliers}
          products={state.products}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default OrdersPage;
