export interface SupplierOrderData {
  id: string;
  supplierId: string;
  supplierName: string;
  products: { 
    productId: string; 
    productName: string;
    quantity: number; 
    price: number;
    subtotal: number;
  }[];
  status: 'pending' | 'approved' | 'received' | 'cancelled';
  orderDate: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  total: number;
  notes?: string;
}

export const mockSupplierOrders: SupplierOrderData[] = [
  {
    id: 'SO-001',
    supplierId: 'SUP-001',
    supplierName: 'Tecnología Global SAC',
    products: [
      {
        productId: 'PROD-001',
        productName: 'Laptop Dell Inspiron 15 3000',
        quantity: 10,
        price: 2299.99,
        subtotal: 22999.90
      },
      {
        productId: 'PROD-004',
        productName: 'Monitor Samsung 24" Full HD',
        quantity: 8,
        price: 799.99,
        subtotal: 6399.92
      }
    ],
    status: 'approved',
    orderDate: '2024-02-28',
    estimatedDelivery: '2024-03-15',
    total: 29399.82,
    notes: 'Pedido urgente para reposición de stock'
  },
  {
    id: 'SO-002',
    supplierId: 'SUP-002',
    supplierName: 'Distribuidora Lima Norte EIRL',
    products: [
      {
        productId: 'PROD-002',
        productName: 'Mouse Inalámbrico Logitech M705',
        quantity: 25,
        price: 169.90,
        subtotal: 4247.50
      },
      {
        productId: 'PROD-012',
        productName: 'Disco Duro Externo 1TB',
        quantity: 15,
        price: 279.90,
        subtotal: 4198.50
      }
    ],
    status: 'received',
    orderDate: '2024-02-20',
    estimatedDelivery: '2024-03-05',
    actualDelivery: '2024-03-04',
    total: 8446.00,
    notes: 'Entrega completada sin problemas'
  },
  {
    id: 'SO-003',
    supplierId: 'SUP-003',
    supplierName: 'Muebles y Decoración del Sur',
    products: [
      {
        productId: 'PROD-006',
        productName: 'Escritorio de Oficina 120x60cm',
        quantity: 5,
        price: 399.99,
        subtotal: 1999.95
      },
      {
        productId: 'PROD-007',
        productName: 'Silla Ergonómica de Oficina',
        quantity: 8,
        price: 549.99,
        subtotal: 4399.92
      }
    ],
    status: 'pending',
    orderDate: '2024-03-01',
    estimatedDelivery: '2024-03-20',
    total: 6399.87,
    notes: 'Pedido para nueva oficina'
  },
  {
    id: 'SO-004',
    supplierId: 'SUP-004',
    supplierName: 'Tech Solutions Import SAC',
    products: [
      {
        productId: 'PROD-005',
        productName: 'Smartphone Samsung Galaxy A54',
        quantity: 12,
        price: 1599.99,
        subtotal: 19199.88
      }
    ],
    status: 'approved',
    orderDate: '2024-02-25',
    estimatedDelivery: '2024-03-12',
    total: 19199.88,
    notes: 'Importación directa desde distribuidor'
  },
  {
    id: 'SO-005',
    supplierId: 'SUP-005',
    supplierName: 'Electrodomésticos Modernos SRL',
    products: [
      {
        productId: 'PROD-009',
        productName: 'Cafetera Oster de 12 Tazas',
        quantity: 20,
        price: 269.99,
        subtotal: 5399.80
      }
    ],
    status: 'received',
    orderDate: '2024-02-15',
    estimatedDelivery: '2024-02-28',
    actualDelivery: '2024-02-27',
    total: 5399.80,
    notes: 'Producto muy demandado'
  },
  {
    id: 'SO-006',
    supplierId: 'SUP-008',
    supplierName: 'Audio y Video Premium EIRL',
    products: [
      {
        productId: 'PROD-008',
        productName: 'Auriculares Sony WH-1000XM4',
        quantity: 6,
        price: 1199.99,
        subtotal: 7199.94
      }
    ],
    status: 'cancelled',
    orderDate: '2024-02-10',
    estimatedDelivery: '2024-02-25',
    total: 7199.94,
    notes: 'Cancelado por problemas de stock del proveedor'
  },
  {
    id: 'SO-007',
    supplierId: 'SUP-004',
    supplierName: 'Tech Solutions Import SAC',
    products: [
      {
        productId: 'PROD-010',
        productName: 'Tablet iPad Air 10.9"',
        quantity: 5,
        price: 3199.99,
        subtotal: 15999.95
      },
      {
        productId: 'PROD-011',
        productName: 'Impresora HP LaserJet Pro',
        quantity: 3,
        price: 849.00,
        subtotal: 2547.00
      }
    ],
    status: 'pending',
    orderDate: '2024-03-02',
    estimatedDelivery: '2024-03-18',
    total: 18546.95,
    notes: 'Productos Apple requieren tiempo adicional'
  }
];

export const getSupplierOrderById = (id: string): SupplierOrderData | undefined => {
  return mockSupplierOrders.find(order => order.id === id);
};

export const getOrdersBySupplierId = (supplierId: string): SupplierOrderData[] => {
  return mockSupplierOrders.filter(order => order.supplierId === supplierId);
};

export const getOrdersByStatus = (status: string): SupplierOrderData[] => {
  return mockSupplierOrders.filter(order => order.status === status);
};

export const getPendingOrders = (): SupplierOrderData[] => {
  return getOrdersByStatus('pending');
};