import { Usuario } from './usuario.model';


export interface LoginResponse {
  success: boolean;
  usuario?: { nome: string; email: string };
  message?: string;
}


