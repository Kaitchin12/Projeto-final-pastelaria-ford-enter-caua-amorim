

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LucroService {
  
  private api = 'http://localhost:2009/obterLucroTotal';
  private lucroTotalSubject = new BehaviorSubject<number>(0);
  lucroTotal$ = this.lucroTotalSubject.asObservable();

  constructor(private http: HttpClient) {}

  carregarLucroTotal() {
    this.http.get<{total: number}>(this.api).subscribe({
      next: (res) => this.lucroTotalSubject.next(res.total),
      error: (err) => console.error(err)
    });
  }

  // Atualiza localmente para dar feedback rápido
  adicionarLucroLocal(valor: number) {
    this.lucroTotalSubject.next(this.lucroTotalSubject.value + valor);
  }
}