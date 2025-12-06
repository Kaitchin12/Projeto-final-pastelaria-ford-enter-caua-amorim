import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 
import { InsumoService } from '../../services/insumos.service';
import { insumos } from '../../../../models/insumos.model';
import { VendaService } from '../../services/venda.service';
import { LucroService } from '../../services/lucro.service';

// Interface para o funcionamento do estoque/pedido
interface InsumoSelecionado {
  insumo: insumos;
  selecionado: boolean;
  gramasPorPastel: number;
}

// Interface para o Carrossel
interface Slide {
  image: string;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  // --- Propriedades do Pedido ---
  modalAberto = false;
  quantidadePasteis = 1; 
  precoVendaPorPastel = 0; 
  insumos: InsumoSelecionado[] = [];

  // --- Propriedades do Carrossel ---
  currentSlide = 0;
  slideInterval: any;
  
  // Imagens do carrossel (Você pode alterar as URLs depois)
  slides: Slide[] = [
    {
      image: 'https://images.unsplash.com/photo-1626804475297-411dbe9175d6?q=80&w=1200',
      title: 'Pastéis Crocantes',
      subtitle: 'O melhor sabor da cidade'
    },
    {
      image: 'https://images.unsplash.com/photo-1606335543042-57c525922933?q=80&w=1200', 
      title: 'Promoção do Dia',
      subtitle: 'Qualidade que você sente'
    },
    {
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200',
      title: 'Ingredientes Frescos',
      subtitle: 'Feito com carinho para você'
    }
  ];

  constructor(
    private insumoService: InsumoService,
    private vendaService: VendaService,
    private lucroService: LucroService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Carrega insumos
    this.insumoService.insumos$.subscribe(lista => {
      this.insumos = lista.map(insumo => ({
        insumo,
        selecionado: false,
        gramasPorPastel: 0
      }));
    });
    this.insumoService.carregarInsumos();

    // Inicia o Carrossel
    this.iniciarAutoPlay();
  }

  // Importante: Limpa o timer quando sai da página para não travar o navegador
  ngOnDestroy(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  // --- Métodos do Carrossel ---

  iniciarAutoPlay() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Muda a cada 5 segundos
  }

  prevSlide() {
    this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
    this.resetTimer();
  }

  nextSlide() {
    this.currentSlide = this.currentSlide === this.slides.length - 1 ? 0 : this.currentSlide + 1;
    this.resetTimer();
  }

  irParaSlide(index: number) {
    this.currentSlide = index;
    this.resetTimer();
  }

  resetTimer() {
    clearInterval(this.slideInterval);
    this.iniciarAutoPlay();
  }

  // --- Métodos do Pedido/Modal ---

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