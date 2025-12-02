import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { insumos } from '../../../models/insumos.model';
import { VendaService } from './venda.service';


// Interface simplificada apenas para visualização no front, se necessário
export interface PedidoResumo {
  quantidadePasteis: number;
  totalVenda: number;
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private pedidoAtual = new BehaviorSubject<PedidoResumo | null>(null);
  pedidoAtual$ = this.pedidoAtual.asObservable();

  constructor(
    private vendaService: VendaService,
  ) {}

  
  realizarPedido(
    quantidadePasteis: number,
    insumosSelecionados: { insumo: insumos; gramasPorPastel: number }[],
    precoVendaPorPastel: number
  ) {
    
    //testar depois
    for (const item of insumosSelecionados) {
      const totalUsar = item.gramasPorPastel * quantidadePasteis;
      if (item.insumo.quantidade < totalUsar) {
       alert(`Quantidade insuficiente do insumo: ${item.insumo.nome}`);
        return;
      }
    }
    
    const itensParaAPI = insumosSelecionados.map(item => ({
      id: item.insumo.id,
      quantidade_usada: item.gramasPorPastel * quantidadePasteis
      
    }));
    

    const valorTotalVenda = precoVendaPorPastel * quantidadePasteis;

    // 2. Chama a VendaService (que fala com o Back-end)
    return this.vendaService.realizarVendaPersonalizada(itensParaAPI, valorTotalVenda);
  }

  // Métodos auxiliares de estado (opcionais)
  limparPedido() {
    this.pedidoAtual.next(null);
  }
}