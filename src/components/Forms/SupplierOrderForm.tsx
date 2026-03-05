import React, { useState, useEffect } from 'react';
import { SupplierOrder, Product, Supplier } from '../../hooks/useInventory';
import { formatCurrency } from '../../services';

interface SupplierOrderFormProps {
  order?: SupplierOrder | null;
  suppliers: Supplier[];
  products: Product[];
  onSubmit: (orderData: Omit<SupplierOrder, 'id' | 'status' | 'orderDate'>) => void;
  onCancel: () => void;
}

const SupplierOrderForm: React.FC<SupplierOrderFormProps> = ({
  order,
  suppliers,
  products,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    supplierId: '',
    estimatedDelivery: '',
    products: [{ productId: '', quantity: 1, price: 0 }]
  });

  useEffect(() => {
    if (order) {
      setFormData({
        supplierId: order.supplierId,
        estimatedDelivery: order.estimatedDelivery,
        products: order.products
      });
    } else {
      setFormData({
        supplierId: '',
        estimatedDelivery: '',
        products: [{ productId: '', quantity: 1, price: 0 }]
      });
    }
  }, [order]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    if (formData.supplierId && formData.estimatedDelivery && formData.products.every(p => p.productId && p.quantity > 0)) {
      const total = formData.products.reduce((sum, product) => sum + (product.quantity * product.price), 0);
      
      onSubmit({
        supplierId: formData.supplierId,
        products: formData.products,
        estimatedDelivery: formData.estimatedDelivery,
        total
      });
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="supplierId" className="form-group__label">
              Proveedor *
            </label>
            <select
              id="supplierId"
              name="supplierId"
              value={formData.supplierId}
              onChange={handleInputChange}
              required
              className="form-group__input"
            >
              <option value="">Seleccionar proveedor...</option>
              {suppliers.map(supplier => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="estimatedDelivery" className="form-group__label">
              Fecha de Entrega Estimada *
            </label>
            <input
              type="date"
              id="estimatedDelivery"
              name="estimatedDelivery"
              value={formData.estimatedDelivery}
              onChange={handleInputChange}
              required
              className="form-group__input"
            />
          </div>
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
                  <label className="form-group__label">
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
                    className="form-group__input"
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
                  <label className="form-group__label">
                    Cantidad *
                  </label>
                  <input
                    type="number"
                    value={product.quantity}
                    onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value))}
                    min="1"
                    required
                    className="form-group__input"
                  />
                </div>
                
                <div>
                  <label className="form-group__label">
                    Precio Unitario (S/)
                  </label>
                  <input
                    type="number"
                    value={product.price}
                    onChange={(e) => handleProductChange(index, 'price', parseFloat(e.target.value))}
                    step="0.01"
                    min="0"
                    className="form-group__input"
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
            <div className="text-right">
              <span className="text-lg font-semibold text-black">
                Total: {formatCurrency(formData.products.reduce((sum, product) => sum + (product.quantity * product.price), 0))}
              </span>
            </div>
          </div>
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

export default SupplierOrderForm;