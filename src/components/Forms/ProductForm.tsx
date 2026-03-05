import React, { useState, useEffect } from 'react';
import { Product } from '../../hooks/useInventory';

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (productData: Omit<Product, 'id'>) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: 0,
    stock: 0,
    minStock: 0,
    manufacturer: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        stock: product.stock,
        minStock: product.minStock,
        manufacturer: product.manufacturer
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numberFields = ['price', 'stock', 'minStock'];
    
    setFormData(prev => ({
      ...prev,
      [name]: numberFields.includes(name) ? Number(value) : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
    }

    if (formData.minStock < 0) {
      newErrors.minStock = 'El stock mínimo no puede ser negativo';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'La categoría es requerida';
    }

    if (!formData.manufacturer.trim()) {
      newErrors.manufacturer = 'El fabricante es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };

  const categories = [
    'Electrónicos',
    'Ropa',
    'Hogar',
    'Deportes',
    'Libros',
    'Salud y Belleza',
    'Juguetes',
    'Automotriz',
    'Alimentación',
    'Otros'
  ];

  return (
    <form onSubmit={handleSubmit} className="product-form p-6">
      <div className="product-form__grid grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="product-form__field">
          <label htmlFor="name" className="form-group__label">
            Nombre del Producto*
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`form-group__input ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ingrese el nombre del producto"
          />
          {errors.name && <p className="product-form__error text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div className="product-form__field md:col-span-2">
          <label htmlFor="description" className="form-group__label">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="product-form__textarea w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Descripción del producto"
          />
        </div>

        <div className="product-form__field">
          <label htmlFor="category" className="form-group__label">
            Categoría*
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`product-form__select w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Seleccione una categoría</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && <p className="product-form__error text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>

        <div className="product-form__field">
          <label htmlFor="manufacturer" className="form-group__label">
            Fabricante*
          </label>
          <input
            type="text"
            id="manufacturer"
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleChange}
            className={`form-group__input ${
              errors.manufacturer ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Nombre del fabricante"
          />
          {errors.manufacturer && <p className="product-form__error text-red-500 text-sm mt-1">{errors.manufacturer}</p>}
        </div>

        <div className="product-form__field">
          <label htmlFor="price" className="form-group__label">
            Precio*
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className={`form-group__input ${
              errors.price ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00"
          />
          {errors.price && <p className="product-form__error text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>

        <div className="product-form__field">
          <label htmlFor="stock" className="form-group__label">
            Stock Actual*
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            className={`form-group__input ${
              errors.stock ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0"
          />
          {errors.stock && <p className="product-form__error text-red-500 text-sm mt-1">{errors.stock}</p>}
        </div>

        <div className="product-form__field">
          <label htmlFor="minStock" className="form-group__label">
            Stock Mínimo*
          </label>
          <input
            type="number"
            id="minStock"
            name="minStock"
            value={formData.minStock}
            onChange={handleChange}
            min="0"
            className={`form-group__input ${
              errors.minStock ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0"
          />
          {errors.minStock && <p className="product-form__error text-red-500 text-sm mt-1">{errors.minStock}</p>}
        </div>
      </div>

      <div className="product-form__actions flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="product-form__button product-form__button--cancel px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="product-form__button product-form__button--submit px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {product ? 'Actualizar' : 'Crear'} Producto
        </button>
      </div>
    </form>
  );
};

export default ProductForm;