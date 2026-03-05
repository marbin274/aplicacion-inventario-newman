export interface CustomerOrderData {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  customerDni?: string;
  products: { 
    productId: string; 
    productName: string;
    quantity: number; 
    price: number;
    subtotal: number;
  }[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  shippedDate?: string;
  deliveredDate?: string;
  total: number;
  shippingCost: number;
  paymentMethod: string;
  notes?: string;
}

export const mockCustomerOrders: CustomerOrderData[] = [
  {
    id: 'CO-001',
    customerName: 'María González Pérez',
    customerEmail: 'maria.gonzalez@gmail.com',
    customerPhone: '+51 987-654-321',
    customerAddress: 'Av. Larco 1234, Apartment 5B, Miraflores, Lima',
    customerDni: '12345678',
    products: [
      {
        productId: 'PROD-001',
        productName: 'Laptop Dell Inspiron 15 3000',
        quantity: 1,
        price: 2499.99,
        subtotal: 2499.99
      },
      {
        productId: 'PROD-002',
        productName: 'Mouse Inalámbrico Logitech M705',
        quantity: 2,
        price: 189.90,
        subtotal: 379.80
      }
    ],
    status: 'delivered',
    orderDate: '2024-02-20',
    shippedDate: '2024-02-22',
    deliveredDate: '2024-02-25',
    total: 2879.79,
    shippingCost: 25.00,
    paymentMethod: 'Tarjeta de Crédito',
    notes: 'Entrega exitosa, cliente satisfecho'
  },
  {
    id: 'CO-002',
    customerName: 'Carlos Eduardo Ramírez',
    customerEmail: 'carlos.ramirez@outlook.com',
    customerPhone: '+51 956-123-789',
    customerAddress: 'Jr. de la Unión 567, Cercado de Lima',
    customerDni: '87654321',
    products: [
      {
        productId: 'PROD-003',
        productName: 'Teclado Mecánico Gaming RGB',
        quantity: 1,
        price: 359.99,
        subtotal: 359.99
      },
      {
        productId: 'PROD-004',
        productName: 'Monitor Samsung 24" Full HD',
        quantity: 1,
        price: 899.99,
        subtotal: 899.99
      }
    ],
    status: 'shipped',
    orderDate: '2024-03-01',
    shippedDate: '2024-03-03',
    total: 1259.98,
    shippingCost: 30.00,
    paymentMethod: 'Transferencia Bancaria',
    notes: 'Pedido para setup de gaming'
  },
  {
    id: 'CO-003',
    customerName: 'Ana Lucía Torres Vega',
    customerEmail: 'ana.torres@hotmail.com',
    customerPhone: '+51 945-678-234',
    customerAddress: 'Av. Salaverry 890, Jesús María, Lima',
    customerDni: '45678912',
    products: [
      {
        productId: 'PROD-005',
        productName: 'Smartphone Samsung Galaxy A54',
        quantity: 1,
        price: 1699.99,
        subtotal: 1699.99
      }
    ],
    status: 'processing',
    orderDate: '2024-03-02',
    total: 1699.99,
    shippingCost: 20.00,
    paymentMethod: 'Yape',
    notes: 'Cliente solicita entrega urgente'
  },
  {
    id: 'CO-004',
    customerName: 'Roberto Silva Mendoza',
    customerEmail: 'roberto.silva@gmail.com',
    customerPhone: '+51 934-567-890',
    customerAddress: 'Av. Universitaria 432, San Miguel, Lima',
    customerDni: '78912345',
    products: [
      {
        productId: 'PROD-006',
        productName: 'Escritorio de Oficina 120x60cm',
        quantity: 1,
        price: 449.99,
        subtotal: 449.99
      },
      {
        productId: 'PROD-007',
        productName: 'Silla Ergonómica de Oficina',
        quantity: 1,
        price: 599.99,
        subtotal: 599.99
      },
      {
        productId: 'PROD-009',
        productName: 'Cafetera Oster de 12 Tazas',
        quantity: 1,
        price: 299.99,
        subtotal: 299.99
      }
    ],
    status: 'pending',
    orderDate: '2024-03-03',
    total: 1349.97,
    shippingCost: 50.00,
    paymentMethod: 'Plin',
    notes: 'Pedido para oficina en casa'
  },
  {
    id: 'CO-005',
    customerName: 'Patricia Jiménez Castro',
    customerEmail: 'patricia.jimenez@yahoo.com',
    customerPhone: '+51 923-456-789',
    customerAddress: 'Av. Brasil 665, Magdalena del Mar, Lima',
    customerDni: '23456789',
    products: [
      {
        productId: 'PROD-008',
        productName: 'Auriculares Sony WH-1000XM4',
        quantity: 1,
        price: 1299.99,
        subtotal: 1299.99
      }
    ],
    status: 'cancelled',
    orderDate: '2024-02-28',
    total: 1299.99,
    shippingCost: 25.00,
    paymentMethod: 'Tarjeta de Débito',
    notes: 'Cliente canceló por motivos personales'
  },
  {
    id: 'CO-006',
    customerName: 'Luis Fernando Morales',
    customerEmail: 'luis.morales@gmail.com',
    customerPhone: '+51 912-345-678',
    customerAddress: 'Av. El Sol 234, Cusco, Cusco',
    customerDni: '34567891',
    products: [
      {
        productId: 'PROD-010',
        productName: 'Tablet iPad Air 10.9"',
        quantity: 1,
        price: 3299.99,
        subtotal: 3299.99
      },
      {
        productId: 'PROD-012',
        productName: 'Disco Duro Externo 1TB',
        quantity: 1,
        price: 299.90,
        subtotal: 299.90
      }
    ],
    status: 'delivered',
    orderDate: '2024-02-18',
    shippedDate: '2024-02-20',
    deliveredDate: '2024-02-24',
    total: 3599.89,
    shippingCost: 45.00,
    paymentMethod: 'Transferencia Bancaria',
    notes: 'Envío a provincia, entrega exitosa'
  },
  {
    id: 'CO-007',
    customerName: 'Carmen Rosa Díaz Flores',
    customerEmail: 'carmen.diaz@outlook.com',
    customerPhone: '+51 901-234-567',
    customerAddress: 'Jr. Tacna 456, Huancayo, Junín',
    customerDni: '56789123',
    products: [
      {
        productId: 'PROD-011',
        productName: 'Impresora HP LaserJet Pro',
        quantity: 1,
        price: 899.00,
        subtotal: 899.00
      }
    ],
    status: 'processing',
    orderDate: '2024-03-01',
    total: 899.00,
    shippingCost: 35.00,
    paymentMethod: 'Tarjeta de Crédito',
    notes: 'Impresora para negocio familiar'
  },
  {
    id: 'CO-008',
    customerName: 'José Miguel Vargas Alcántara',
    customerEmail: 'jose.vargas@gmail.com',
    customerPhone: '+51 890-123-456',
    customerAddress: 'Av. Víctor Larco 789, La Molina, Lima',
    customerDni: '67891234',
    products: [
      {
        productId: 'PROD-002',
        productName: 'Mouse Inalámbrico Logitech M705',
        quantity: 3,
        price: 189.90,
        subtotal: 569.70
      },
      {
        productId: 'PROD-003',
        productName: 'Teclado Mecánico Gaming RGB',
        quantity: 2,
        price: 359.99,
        subtotal: 719.98
      }
    ],
    status: 'pending',
    orderDate: '2024-03-04',
    total: 1289.68,
    shippingCost: 25.00,
    paymentMethod: 'Yape',
    notes: 'Pedido para equipo de trabajo'
  }
];

export const getCustomerOrderById = (id: string): CustomerOrderData | undefined => {
  return mockCustomerOrders.find(order => order.id === id);
};

export const getOrdersByCustomerEmail = (email: string): CustomerOrderData[] => {
  return mockCustomerOrders.filter(order => order.customerEmail === email);
};

export const getOrdersByStatus = (status: string): CustomerOrderData[] => {
  return mockCustomerOrders.filter(order => order.status === status);
};

export const getPendingCustomerOrders = (): CustomerOrderData[] => {
  return getOrdersByStatus('pending');
};

export const getOrdersByDateRange = (startDate: string, endDate: string): CustomerOrderData[] => {
  return mockCustomerOrders.filter(order => 
    order.orderDate >= startDate && order.orderDate <= endDate
  );
};