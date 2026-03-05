import React, { useState, useEffect } from 'react';
import { CustomerOrder, Product } from '../../hooks/useInventory';

interface CustomerOrderFormProps {
  order?: CustomerOrder | null;
  products: Product[];
  onSubmit: (orderData: Omit<CustomerOrder, 'id' | 'status' | 'orderDate'>) => void;
  onCancel: () => void;
}

const CustomerOrderForm: React.FC<CustomerOrderFormProps> = ({
  order,
  products,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    customerDni: '',
    paymentMethod: '',
    shippingCost: 0,
    notes: '',
    products: [{ productId: '', quantity: 1, price: 0 }]
  });

  useEffect(() => {
    if (order) {
      setFormData({
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone || '',
        customerAddress: order.customerAddress || '',
        customerDni: order.customerDni || '',
        paymentMethod: order.paymentMethod || '',
        shippingCost: order.shippingCost || 0,
        notes: order.notes || '',
        products: order.products
      });
    } else {
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        customerAddress: '',
        customerDni: '',
        paymentMethod: '',
        shippingCost: 0,
        notes: '',
        products: [{ productId: '', quantity: 1, price: 0 }]
      });
    }
  }, [order]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'number' ? parseFloat(value) || 0 : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleProductChange = (index: number, field: string, value: any) => {
    const newProducts = [...formData.products];
    newProducts[index] = { ...newProducts[index], [field]: value };
    setFormData(prev => ({ ...prev, products: newProducts }));
  };

  const addProduct = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, { productId: '', quantity: 1, price: 0 }]
    }));
  };

  const removeProduct = (index: number) => {
    if (formData.products.length > 1) {
      const newProducts = formData.products.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, products: newProducts }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.customerName && formData.customerEmail && formData.products.every(p => p.productId && p.quantity > 0)) {
      const subtotal = formData.products.reduce((sum, product) => sum + (product.quantity * product.price), 0);
      const total = subtotal + formData.shippingCost;
      
      onSubmit({
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        customerAddress: formData.customerAddress,
        customerDni: formData.customerDni,
        products: formData.products,
        total,
        shippingCost: formData.shippingCost,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes
      });
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="customerName" className="form-group__label">
              Nombre del Cliente *
            </label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Ej: María González"
            />
          </div>
          
          <div>
            <label htmlFor="customerEmail" className="form-group__label">
              Email *
            </label>
            <input
              type="email"
              id="customerEmail"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Ej: maria.gonzalez@email.com"
            />
          </div>
          
          <div>
            <label htmlFor="customerPhone" className="form-group__label">
              Teléfono
            </label>
            <input
              type="tel"
              id="customerPhone"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Ej: +51 9xx xxx xxx"
            />
          </div>
          
          <div>
            <label htmlFor="customerDni" className="form-group__label">
              DNI
            </label>
            <input
              type="text"
              id="customerDni"
              name="customerDni"
              value={formData.customerDni}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Ej: 12345678"
            />
          </div>
          
          <div>
            <label htmlFor="paymentMethod" className="form-group__label">
              Método de Pago
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">Seleccionar método...</option>
              <option value="Yape">Yape</option>
              <option value="Plin">Plin</option>
              <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
              <option value="Tarjeta de Débito">Tarjeta de Débito</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Transferencia Bancaria">Transferencia Bancaria</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="shippingCost" className="form-group__label">
              Costo de Envío (S/)
            </label>
            <input
              type="number"
              id="shippingCost"
              name="shippingCost"
              value={formData.shippingCost}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="0.00"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="customerAddress" className="form-group__label">
            Dirección de Entrega
          </label>
          <textarea
            id="customerAddress"
            name="customerAddress"
            value={formData.customerAddress}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Ej: Av. Ejemplo 123, Lima, Perú"
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-median text-gray-900 dark:text-white">Productos</h4>
            <button
              type="button"
              onClick={addProduct}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              + Agregar Producto
            </button>
          </div>
          
          <div className="space-y-3">
            {formData.products.map((product, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border border-gray-200 rounded-lg">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Producto *
                  </label>
                  <select
                    value={product.productId}
                    onChange={(e) => {
                      const selectedProduct = products.find(p => p.id === e.target.value);
                      handleProductChange(index, 'productId', e.target.value);
                      if (selectedProduct) {
                        handleProductChange(index, 'price', selectedProduct.price);
                      }
                    }}
                    required
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">Seleccionar...</option>
                    {products.map(prod => (
                      <option key={prod.id} value={prod.id}>
                        {prod.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Cantidad *
                  </label>
                  <input
                    type="number"
                    value={product.quantity}
                    onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value))}
                    min="1"
                    required
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Precio Unitario (S/)
                  </label>
                  <input
                    type="number"
                    value={product.price}
                    onChange={(e) => handleProductChange(index, 'price', parseFloat(e.target.value))}
                    step="0.01"
                    min="0"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                
                <div className="flex items-end">
                  {formData.products.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProduct(index)}
                      className="px-2 py-1 text-sm text-red-600 hover:text-red-800 transition-colors"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="resume_operation">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Subtotal:</span>
              <span className="text-sm font-medium">
                S/ {formData.products.reduce((sum, product) => sum + (product.quantity * product.price), 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Envío:</span>
              <span className="text-sm font-medium">S/ {formData.shippingCost.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center border-t pt-2 mt-2">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-lg font-semibold text-gray-900">
                S/ {(formData.products.reduce((sum, product) => sum + (product.quantity * product.price), 0) + formData.shippingCost).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="notes" className="form-group__label">
            Notas Adicionales
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={2}
            className="form-group__input"
            placeholder="Notas especiales sobre el pedido..."
          />
        </div>
        
        <div className="flex gap-2 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {order ? 'Actualizar Pedido' : 'Crear Pedido'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerOrderForm;