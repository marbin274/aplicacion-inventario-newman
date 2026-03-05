export interface UserData {
  id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  name: string;
}

export const allowedUsers: UserData[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@inventario.com',
    password: 'admin123',
    role: 'Administrador',
    name: 'Administrador del Sistema'
  },
  {
    id: '2',
    username: 'manager',
    email: 'manager@inventario.com', 
    password: 'manager456',
    role: 'Gerente',
    name: 'Gerente de Inventario'
  },
  {
    id: '3',
    username: 'operator',
    email: 'operator@inventario.com',
    password: 'operator789',
    role: 'Operador',
    name: 'Operador de Almacén'
  }
];

export const findUserByCredentials = (username: string, password: string): UserData | null => {
  const user = allowedUsers.find(u => u.username === username && u.password === password);
  return user || null;
};