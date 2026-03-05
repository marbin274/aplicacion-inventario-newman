export interface ProductData {
  id: string;
  name: string;
  category: string;
  manufacturer: string;
  price: number;
  stock: number;
  minStock: number;
  description: string;
}

export const mockProducts: ProductData[] = [
  {
    id: 'PROD-001',
    name: 'Laptop Dell Inspiron 15 3000',
    category: 'Electrónicos',
    manufacturer: 'Dell Technologies',
    price: 2499.99,
    stock: 0,
    minStock: 5,
    description: 'Laptop con procesador Intel Core i5, 8GB RAM, 256GB SSD, pantalla 15.6 pulgadas'
  },
  {
    id: 'PROD-002', 
    name: 'Mouse Inalámbrico Logitech M705',
    category: 'Electrónicos',
    manufacturer: 'Logitech',
    price: 189.90,
    stock: 45,
    minStock: 10,
    description: 'Mouse inalámbrico con receptor USB, batería de larga duración, ergonómico'
  },
  {
    id: 'PROD-003',
    name: 'Teclado Mecánico Gaming RGB',
    category: 'Electrónicos', 
    manufacturer: 'HyperX',
    price: 359.99,
    stock: 8,
    minStock: 3,
    description: 'Teclado mecánico con switches Cherry MX, iluminación RGB, resistente al agua'
  },
  {
    id: 'PROD-004',
    name: 'Monitor Samsung 24" Full HD',
    category: 'Electrónicos',
    manufacturer: 'Samsung Electronics',
    price: 899.99,
    stock: 12,
    minStock: 4,
    description: 'Monitor LED 24 pulgadas, resolución 1920x1080, 75Hz, conectores HDMI y VGA'
  },
  {
    id: 'PROD-005',
    name: 'Smartphone Samsung Galaxy A54',
    category: 'Electrónicos',
    manufacturer: 'Samsung Electronics',
    price: 1699.99,
    stock: 25,
    minStock: 8,
    description: 'Smartphone con pantalla 6.4", 128GB almacenamiento, cámara triple 50MP'
  },
  {
    id: 'PROD-006',
    name: 'Escritorio de Oficina 120x60cm',
    category: 'Hogar',
    manufacturer: 'Muebles Perú SAC',
    price: 449.99,
    stock: 6,
    minStock: 2,
    description: 'Escritorio de melamina color rovere, con cajón, ideal para oficina en casa'
  },
  {
    id: 'PROD-007',
    name: 'Silla Ergonómica de Oficina',
    category: 'Hogar',
    manufacturer: 'Office Solutions',
    price: 599.99,
    stock: 3,
    minStock: 4,
    description: 'Silla giratoria con apoyo lumbar, brazos ajustables, base cromada'
  },
  {
    id: 'PROD-008',
    name: 'Auriculares Sony WH-1000XM4',
    category: 'Electrónicos',
    manufacturer: 'Sony Corporation',
    price: 1299.99,
    stock: 3,
    minStock: 5,
    description: 'Auriculares inalámbricos con cancelación de ruido activa, hasta 30 horas de batería'
  },
  {
    id: 'PROD-009',
    name: 'Cafetera Oster de 12 Tazas',
    category: 'Hogar',
    manufacturer: 'Oster',
    price: 299.99,
    stock: 18,
    minStock: 6,
    description: 'Cafetera automática programable, jarra de vidrio, función auto-apagado'
  },
  {
    id: 'PROD-010',
    name: 'Tablet iPad Air 10.9"',
    category: 'Electrónicos',
    manufacturer: 'Apple Inc.',
    price: 3299.99,
    stock: 7,
    minStock: 3,
    description: 'Tablet con chip M1, pantalla Liquid Retina, 64GB WiFi, compatible con Apple Pencil'
  },
  {
    id: 'PROD-011',
    name: 'Impresora HP LaserJet Pro',
    category: 'Electrónicos',
    manufacturer: 'HP Inc.',
    price: 899.00,
    stock: 4,
    minStock: 2,
    description: 'Impresora láser monocromática, velocidad 22 ppm, conectividad WiFi y USB'
  },
  {
    id: 'PROD-012',
    name: 'Disco Duro Externo 1TB',
    category: 'Electrónicos',
    manufacturer: 'Western Digital',
    price: 299.90,
    stock: 22,
    minStock: 8,
    description: 'Disco duro portátil USB 3.0, compatible con Windows y Mac, color negro'
  }
];

export const getProductById = (id: string): ProductData | undefined => {
  return mockProducts.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): ProductData[] => {
  return mockProducts.filter(product => product.category === category);
};

export const getLowStockProducts = (): ProductData[] => {
  return mockProducts.filter(product => product.stock <= product.minStock);
};