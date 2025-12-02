import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { insumos } from '../../../models/insumos.model'; 

@Injectable({
  providedIn: 'root'
})
export class InsumoService {

  private api = 'http://localhost:2009';

  private insumosSubject = new BehaviorSubject<insumos[]>([]);
  insumos$ = this.insumosSubject.asObservable();

  constructor(private http: HttpClient) {}

  carregarInsumos() {
    this.http.get<insumos[]>(`${this.api}/insumos`)
      .subscribe((dados: insumos[]) => {
        this.insumosSubject.next(dados);
      });
  }

  cadastrarInsumo(insumo: insumos) {
    return this.http.post(`${this.api}/cadastrarInsumo`, insumo)
      .subscribe(() => {
        this.carregarInsumos();
      });
  }


   atualizarInsumo(insumo: insumos) {
  return this.http.post(`${this.api}/updateInsumo`, {
    id: insumo.id,
    nome : insumo.nome,
    quantidade: insumo.quantidade,
    preco_kg : insumo.preco_kg
  }).subscribe(() => {
    this.carregarInsumos();
  });
} 

  // Deletar insumo
  deletarInsumo(id?: number) {
    if (!id) return;
    return this.http.post(`${this.api}/deletarInsumo`, { id })
      .subscribe(() => this.carregarInsumos());
  }

  
}