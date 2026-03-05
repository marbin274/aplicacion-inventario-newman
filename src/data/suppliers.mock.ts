export interface SupplierData {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address?: string;
  ruc?: string;
  country: string;
  category: string;
}

export const mockSuppliers: SupplierData[] = [
  {
    id: 'SUP-001',
    name: 'Tecnología Global SAC',
    contact: 'Carlos Mendoza',
    email: 'carlos@tecnologiaglobal.pe',
    phone: '+51 1 445-7892',
    address: 'Av. Javier Prado Este 1234, San Isidro, Lima',
    ruc: '20567845123',
    country: 'Perú',
    category: 'Tecnología y Electrónicos'
  },
  {
    id: 'SUP-002',
    name: 'Distribuidora Lima Norte EIRL',
    contact: 'Ana García',
    email: 'ana.garcia@limamante.pe',
    phone: '+51 1 567-1234',
    address: 'Jr. Ucayali 456, Cercado de Lima',
    ruc: '20123456789',
    country: 'Perú',
    category: 'Distribución General'
  },
  {
    id: 'SUP-003',
    name: 'Muebles y Decoración del Sur',
    contact: 'Roberto Villalobos',
    email: 'rvillalobos@mueblessur.pe',
    phone: '+51 54 789-456',
    address: 'Av. Dolores 789, José Luis Bustamante y Rivero, Arequipa',
    ruc: '20987654321',
    country: 'Perú',
    category: 'Muebles y Hogar'
  },
  {
    id: 'SUP-004',
    name: 'Tech Solutions Import SAC',
    contact: 'Luis Fernando Castro',
    email: 'lcastro@techsolutions.pe',
    phone: '+51 44 234-567',
    address: 'Av. España 321, Trujillo, La Libertad',
    ruc: '20456789123',
    country: 'Perú',
    category: 'Importación Tecnológica'
  },
  {
    id: 'SUP-005',
    name: 'Electrodomésticos Modernos SRL',
    contact: 'María Elena Rodríguez',
    email: 'mrodriguez@electromodernos.pe',
    phone: '+51 1 789-2345',
    address: 'Av. Arenales 987, Lince, Lima',
    ruc: '20789456123',
    country: 'Perú',
    category: 'Electrodomésticos'
  },
  {
    id: 'SUP-006',
    name: 'Importadora Tecnológica Internacional',
    contact: 'Jorge Salas',
    email: 'jsalas@tecinternacional.pe',
    phone: '+51 1 334-5678',
    address: 'Av. República de Panamá 2468, La Victoria, Lima',
    ruc: '20345678912',
    country: 'Perú',
    category: 'Importación de Tecnología'
  },
  {
    id: 'SUP-007',
    name: 'Oficinas y Escritorios SAC',
    contact: 'Patricia Núñez',
    email: 'patricia@oficinasesc.pe',
    phone: '+51 1 567-8901',
    address: 'Av. 28 de Julio 654, Miraflores, Lima',
    ruc: '20654321987',
    country: 'Perú',
    category: 'Mobiliario de Oficina'
  },
  {
    id: 'SUP-008',
    name: 'Audio y Video Premium EIRL',
    contact: 'Daniel Torres',
    email: 'dtorres@audiovideo.pe',
    phone: '+51 74 456-789',
    address: 'Av. Grau 147, Piura, Piura',
    ruc: '20147258369',
    country: 'Perú',
    category: 'Audio y Video'
  }
];

export const getSupplierById = (id: string): SupplierData | undefined => {
  return mockSuppliers.find(supplier => supplier.id === id);
};

export const getSuppliersByCategory = (category: string): SupplierData[] => {
  return mockSuppliers.filter(supplier => supplier.category === category);
};