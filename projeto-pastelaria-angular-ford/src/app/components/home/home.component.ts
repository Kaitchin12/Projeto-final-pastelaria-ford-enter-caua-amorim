import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 
import { InsumoService } from '../../services/insumos.service';
import { insumos } from '../../../../models/insumos.model';
import { VendaService } from '../../services/venda.service';
import { LucroService } from '../../services/lucro.service';

interface InsumoSelecionado {
  insumo: insumos;
  selecionado: boolean;
  gramasPorPastel: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  modalAberto = false;
  quantidadePasteis = 1; 
  precoVendaPorPastel = 0; 

  insumos: InsumoSelecionado[] = [];

  constructor(
    private insumoService: InsumoService,
    private vendaService: VendaService,
    private lucroService: LucroService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.insumoService.insumos$.subscribe(lista => {
      this.insumos = lista.map(insumo => ({
        insumo,
        selecionado: false,
        gramasPorPastel: 0
      }));
    });
    this.insumoService.carregarInsumos();
  }

  abrirModal() { 
    this.modalAberto = true;
    
    // Zera os valores sempre que abrir o modal para um novo pedido
    this.quantidadePasteis = 1;
    this.precoVendaPorPastel = 0; 
  }
  
  fecharModal() { this.modalAberto = false; }

  calcularTotalGramas(item: InsumoSelecionado): number {
    return item.gramasPorPastel * this.quantidadePasteis;
  }

  confirmarPedido() {
    // 1. Valida se o usuário digitou o preço
    if (this.precoVendaPorPastel <= 0) {
      alert("Por favor, digite o preço de venda do pastel!");
      return;
    }

    // 2. Filtra os ingredientes selecionados
    const selecionados = this.insumos.filter(i => i.selecionado && i.gramasPorPastel > 0);

    if (selecionados.length === 0) {
      alert("Selecione os ingredientes gastos e a gramatura!");
      return;
    }

    // 3. Prepara o pacote para a API (ID e quantidade total usada)
    const itensParaAPI = selecionados.map(item => ({
      id: item.insumo.id,
      quantidade_usada: item.gramasPorPastel * this.quantidadePasteis 
    }));

    // 4. Calcula o total que entrou no caixa
    const valorTotalVenda = this.precoVendaPorPastel * this.quantidadePasteis;

    // 5. Envia para o Back-end
    this.vendaService.realizarVendaPersonalizada(itensParaAPI, valorTotalVenda)
      .subscribe({
        next: (res: any) => {
          // Atualiza o lucro acumulado na memória
          if (res.lucro) this.lucroService.adicionarLucroLocal(res.lucro);

          // Atualiza a lista de estoque (baixa visual)
          this.insumoService.carregarInsumos();

        
          this.fecharModal();
          this.router.navigate(['/lucro']); 
        },
        error: (err) => {
          console.error(err);
          alert('Erro ao realizar venda.');
        }
      });
  }
}