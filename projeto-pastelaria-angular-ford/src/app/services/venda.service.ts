
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class VendaService {
  private apiBase = 'http://localhost:2009';

  constructor(private http: HttpClient) { }

  realizarVendaPersonalizada(itens: { id: number, quantidade_usada: number }[], valorTotal: number) {
    return this.http.post(`${this.apiBase}/vendaPersonalizada`, {
      itens: itens,
      valor_total: valorTotal
    });
  }
}