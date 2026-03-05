import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { mockProducts } from '../data/products.mock'
import { mockSuppliers } from '../data/suppliers.mock'
import { mockSupplierOrders } from '../data/supplier-orders.mock'
import { mockCustomerOrders } from '../data/customer-orders.mock'

export interface Product {
  id: string
  name: string
  category: string
  manufacturer: string
  price: number
  stock: number
  minStock: number
  description: string
}

export interface Supplier {
  id: string
  name: string
  contact: string
  email: string
  phone: string
}

export interface SupplierOrder {
  id: string
  supplierId: string
  products: { productId: string; quantity: number; price: number }[]
  status: 'pending' | 'approved' | 'received' | 'cancelled'
  orderDate: string
  estimatedDelivery: string
  total: number
}

export interface CustomerOrder_Product {
  productId: string
  quantity: number
  price: number
}

export type CustomerOrder_ProductPrint = CustomerOrder_Product & Product;

export interface CustomerOrder {
  id: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  customerAddress?: string
  customerDni?: string
  products: CustomerOrder_Product[]
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  orderDate: string
  shippedDate?: string
  deliveredDate?: string
  total: number
  shippingCost: number
  paymentMethod: string
  notes?: string
}

interface InventoryState {
  products: Product[]
  suppliers: Supplier[]
  supplierOrders: SupplierOrder[]
  customerOrders: CustomerOrder[]
}

type InventoryAction =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'SET_SUPPLIERS'; payload: Supplier[] }
  | { type: 'ADD_SUPPLIER'; payload: Supplier }
  | { type: 'UPDATE_SUPPLIER'; payload: Supplier }
  | { type: 'DELETE_SUPPLIER'; payload: string }
  | { type: 'SET_SUPPLIER_ORDERS'; payload: SupplierOrder[] }
  | { type: 'ADD_SUPPLIER_ORDER'; payload: SupplierOrder }
  | { type: 'UPDATE_SUPPLIER_ORDER'; payload: SupplierOrder }
  | { type: 'SET_CUSTOMER_ORDERS'; payload: CustomerOrder[] }
  | { type: 'ADD_CUSTOMER_ORDER'; payload: CustomerOrder }
  | { type: 'UPDATE_CUSTOMER_ORDER'; payload: CustomerOrder }

interface InventoryContextType {
  state: InventoryState
  addProduct: (product: Omit<Product, 'id'>) => void
  updateProduct: (product: Product) => void
  deleteProduct: (id: string) => void
  searchProducts: (query: string) => Product[]
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void
  updateSupplier: (supplier: Supplier) => void
  deleteSupplier: (id: string) => void
  addSupplierOrder: (order: Omit<SupplierOrder, 'id'>) => void
  updateSupplierOrder: (order: SupplierOrder) => void
  addCustomerOrder: (order: Omit<CustomerOrder, 'id'>) => void
  updateCustomerOrder: (order: CustomerOrder) => void
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined)

export function useInventory() {
  const context = useContext(InventoryContext)
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider')
  }
  return context
}

function inventoryReducer(state: InventoryState, action: InventoryAction): InventoryState {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload }
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] }
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p => p.id === action.payload.id ? action.payload : p)
      }
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload)
      }
    case 'SET_SUPPLIERS':
      return { ...state, suppliers: action.payload }
    case 'ADD_SUPPLIER':
      return { ...state, suppliers: [...state.suppliers, action.payload] }
    case 'UPDATE_SUPPLIER':
      return {
        ...state,
        suppliers: state.suppliers.map(s => s.id === action.payload.id ? action.payload : s)
      }
    case 'DELETE_SUPPLIER':
      return {
        ...state,
        suppliers: state.suppliers.filter(s => s.id !== action.payload)
      }
    case 'SET_SUPPLIER_ORDERS':
      return { ...state, supplierOrders: action.payload }
    case 'ADD_SUPPLIER_ORDER':
      return { ...state, supplierOrders: [...state.supplierOrders, action.payload] }
    case 'UPDATE_SUPPLIER_ORDER':
      return {
        ...state,
        supplierOrders: state.supplierOrders.map(o => o.id === action.payload.id ? action.payload : o)
      }
    case 'SET_CUSTOMER_ORDERS':
      return { ...state, customerOrders: action.payload }
    case 'ADD_CUSTOMER_ORDER':
      return { ...state, customerOrders: [...state.customerOrders, action.payload] }
    case 'UPDATE_CUSTOMER_ORDER':
      return {
        ...state,
        customerOrders: state.customerOrders.map(o => o.id === action.payload.id ? action.payload : o)
      }
    default:
      return state
  }
}

function initializeLocalStorage() {
  if (!localStorage.getItem('products')) {
    const initialProducts: Product[] = mockProducts.map(product => ({
      id: product.id,
      name: product.name,
      category: product.category,
      manufacturer: product.manufacturer,
      price: product.price,
      stock: product.stock,
      minStock: product.minStock,
      description: product.description
    }))
    localStorage.setItem('products', JSON.stringify(initialProducts))
  }

  if (!localStorage.getItem('suppliers')) {
    const initialSuppliers: Supplier[] = mockSuppliers.map(supplier => ({
      id: supplier.id,
      name: supplier.name,
      contact: supplier.contact,
      email: supplier.email,
      phone: supplier.phone
    }))
    localStorage.setItem('suppliers', JSON.stringify(initialSuppliers))
  }

  if (!localStorage.getItem('supplierOrders')) {
    const initialSupplierOrders: SupplierOrder[] = mockSupplierOrders.map(order => ({
      id: order.id,
      supplierId: order.supplierId,
      products: order.products.map(p => ({
        productId: p.productId,
        quantity: p.quantity,
        price: p.price
      })),
      status: order.status,
      orderDate: order.orderDate,
      estimatedDelivery: order.estimatedDelivery,
      total: order.total
    }))
    localStorage.setItem('supplierOrders', JSON.stringify(initialSupplierOrders))
  }

  if (!localStorage.getItem('customerOrders')) {
    const initialCustomerOrders: CustomerOrder[] = mockCustomerOrders.map(order => ({
      id: order.id,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      customerAddress: order.customerAddress,
      customerDni: order.customerDni,
      products: order.products.map(p => ({
        productId: p.productId,
        quantity: p.quantity,
        price: p.price
      })),
      status: order.status,
      orderDate: order.orderDate,
      shippedDate: order.shippedDate,
      deliveredDate: order.deliveredDate,
      total: order.total,
      shippingCost: order.shippingCost,
      paymentMethod: order.paymentMethod,
      notes: order.notes
    }))
    localStorage.setItem('customerOrders', JSON.stringify(initialCustomerOrders))
  }
}

// Initialize localStorage before creating initial state
initializeLocalStorage()

const initialState: InventoryState = {
  products: JSON.parse(localStorage.getItem('products') || '[]'),
  suppliers: JSON.parse(localStorage.getItem('suppliers') || '[]'),
  supplierOrders: JSON.parse(localStorage.getItem('supplierOrders') || '[]'),
  customerOrders: JSON.parse(localStorage.getItem('customerOrders') || '[]')
}

interface InventoryProviderProps {
  children: ReactNode
}

export function InventoryProvider({ children }: InventoryProviderProps) {
  const [state, dispatch] = useReducer(inventoryReducer, initialState)

  useEffect(() => {
    const products = localStorage.getItem('products')
    const suppliers = localStorage.getItem('suppliers')
    const supplierOrders = localStorage.getItem('supplierOrders')
    const customerOrders = localStorage.getItem('customerOrders')

    if (products) {
      dispatch({ type: 'SET_PRODUCTS', payload: JSON.parse(products) })
    }

    if (suppliers) {
      dispatch({ type: 'SET_SUPPLIERS', payload: JSON.parse(suppliers) })
    }

    if (supplierOrders) {
      dispatch({ type: 'SET_SUPPLIER_ORDERS', payload: JSON.parse(supplierOrders) })
    }

    if (customerOrders) {
      dispatch({ type: 'SET_CUSTOMER_ORDERS', payload: JSON.parse(customerOrders) })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(state.products))
  }, [state.products])

  useEffect(() => {
    localStorage.setItem('suppliers', JSON.stringify(state.suppliers))
  }, [state.suppliers])

  useEffect(() => {
    localStorage.setItem('supplierOrders', JSON.stringify(state.supplierOrders))
  }, [state.supplierOrders])

  useEffect(() => {
    localStorage.setItem('customerOrders', JSON.stringify(state.customerOrders))
  }, [state.customerOrders])

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now().toString() }
    dispatch({ type: 'ADD_PRODUCT', payload: newProduct })
  }

  const updateProduct = (product: Product) => {
    dispatch({ type: 'UPDATE_PRODUCT', payload: product })
  }

  const deleteProduct = (id: string) => {
    dispatch({ type: 'DELETE_PRODUCT', payload: id })
  }

  const searchProducts = (query: string): Product[] => {
    if (!query.trim()) return state.products

    return state.products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()) ||
      product.manufacturer.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    )
  }

  const addSupplier = (supplier: Omit<Supplier, 'id'>) => {
    const newSupplier = { ...supplier, id: Date.now().toString() }
    dispatch({ type: 'ADD_SUPPLIER', payload: newSupplier })
  }

  const updateSupplier = (supplier: Supplier) => {
    dispatch({ type: 'UPDATE_SUPPLIER', payload: supplier })
  }

  const deleteSupplier = (id: string) => {
    dispatch({ type: 'DELETE_SUPPLIER', payload: id })
  }

  const addSupplierOrder = (order: Omit<SupplierOrder, 'id'>) => {
    const newOrder = { ...order, id: Date.now().toString() }
    dispatch({ type: 'ADD_SUPPLIER_ORDER', payload: newOrder })
  }

  const updateSupplierOrder = (order: SupplierOrder) => {
    dispatch({ type: 'UPDATE_SUPPLIER_ORDER', payload: order })
  }

  const addCustomerOrder = (order: Omit<CustomerOrder, 'id'>) => {
    const newOrder = { ...order, id: Date.now().toString() }
    dispatch({ type: 'ADD_CUSTOMER_ORDER', payload: newOrder })
  }

  const updateCustomerOrder = (order: CustomerOrder) => {
    dispatch({ type: 'UPDATE_CUSTOMER_ORDER', payload: order })
  }

  const value = {
    state,
    addProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    addSupplierOrder,
    updateSupplierOrder,
    addCustomerOrder,
    updateCustomerOrder
  }

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>
}
