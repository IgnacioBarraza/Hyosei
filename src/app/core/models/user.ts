import { Role } from './role';

export interface User {
  id: string;
  name: string;
  email?: string;
  rut?: string;
  created_at: string;
  updated_at: string;
  role: Role;
}
