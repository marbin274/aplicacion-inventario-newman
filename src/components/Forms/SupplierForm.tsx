import React, { useState, useEffect } from 'react';
import { Supplier } from '../../hooks/useInventory';

interface SupplierFormProps {
  supplier?: Supplier | null;
  onSubmit: (supplierData: Omit<Supplier, 'id'>) => void;
  onCancel: () => void;
}

const SupplierForm: React.FC<SupplierFormProps> = ({
  supplier,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name,
        contact: supplier.contact,
        email: supplier.email,
        phone: supplier.phone
      });
    } else {
      setFormData({
        name: '',
        contact: '',
        email: '',
        phone: ''
      });
    }
  }, [supplier]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.contact && formData.email && formData.phone) {
      onSubmit(formData);
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="form-group__label">
            Nombre del Proveedor *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="form-group__input"
            placeholder="Ej: Distribuidora ABC S.A.C."
          />
        </div>
        
        <div>
          <label htmlFor="contact" className="form-group__label">
            Persona de Contacto *
          </label>
          <input
            type="text"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleInputChange}
            required
            className="form-group__input"
            placeholder="Ej: Juan Pérez"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="form-group__label">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="form-group__input"
            placeholder="Ej: contacto@distribuidoraabc.com"
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="form-group__label">
            Teléfono *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="form-group__input"
            placeholder="Ej: +51 9xx xxx xxx"
          />
        </div>
        
        <div className="flex gap-2 pt-4">
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
            {supplier ? 'Actualizar Proveedor' : 'Agregar Proveedor'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SupplierForm;