import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InsumoService } from '../../services/insumos.service';
import { insumos } from '../../../../models/insumos.model';

@Component({
  standalone: true,
  selector: 'app-historico',
  imports: [CommonModule, FormsModule],
  templateUrl: './historico.component.html'
})
export class HistoricoComponent implements OnInit {

  insumos: insumos[] = [];
  
  // Objeto para novo cadastro
  novoInsumo: insumos = {
    id: 0,
    nome: '',
    quantidade: 0,
    preco_kg: 0
  };

  constructor(private insumoService: InsumoService) {}

  ngOnInit(): void {
    // Atualiza a lista de insumos em tempo real
    this.insumoService.insumos$.subscribe(lista => {
      this.insumos = lista;
    });
    this.insumoService.carregarInsumos();
  }


  salvar(form: insumos) {
    if (!form.nome || form.quantidade <= 0) return; 
    this.insumoService.cadastrarInsumo(form);


    this.novoInsumo = {id: 0, nome: '', quantidade: 0, preco_kg: 0 };
  }


  deletarInsumo(id?: number) {
    if (!id) return;
    if (confirm('Deseja realmente deletar este insumo?')) {
      this.insumoService.deletarInsumo(id);
    }
  }

  //corrigir essa parte PORQUE NAO EDITA
  // Seleciona insumo para edição (opcional, caso queira adicionar depois)
  insumoEdit?: insumos;

  editarInsumo(insumo: insumos) {
    this.insumoEdit = { ...insumo };
  }

  salvarEdicao() {
    if (this.insumoEdit) {
      this.insumoService.atualizarInsumo(this.insumoEdit);
      this.insumoEdit = undefined;
    }
  }

  cancelarEdicao() {
    this.insumoEdit = undefined;
  }
}
