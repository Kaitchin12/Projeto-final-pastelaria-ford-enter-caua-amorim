import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../../../models/usuario.model';
import { LoginResponse } from '../../../models/login-response.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://localhost:2009';

  constructor(private http: HttpClient) {}

  login(dados: { email: string; senha: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/login`, dados);
  }

  cadastrar(dados: Usuario): Observable<{ success: boolean; message?: string }> {
    return this.http.post<{ success: boolean; message?: string }>(`${this.api}/cadastrar`, dados);
  }

  isLogged(): boolean {
    return localStorage.getItem('usuario') !== null;
  }

  logout(): void {
    localStorage.removeItem('usuario');
  }
}
