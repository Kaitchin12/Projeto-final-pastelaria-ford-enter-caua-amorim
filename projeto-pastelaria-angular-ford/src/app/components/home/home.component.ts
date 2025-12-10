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
  
 
  slides: Slide[] = [
    {
      image: 'https://s2.glbimg.com/md4D16uQ0vBVD8u8agv0GwGB8oE=/940x523/e.glbimg.com/og/ed/f/original/2017/10/09/pastel.jpg',
      title: 'Pastéis Crocantes',
      subtitle: 'O melhor sabor da cidade'
    },
    {
      image: 'https://media.gettyimages.com/id/1408461792/pt/foto/fresh-sweet-pastry-on-a-display-in-bakery.jpg?s=612x612&w=gi&k=20&c=cFivq-3_85u-2KMf1HVuqBvXJmHDDQKSDqxX13wfI14=', 
      title: 'Promoção do Dia',
      subtitle: 'Qualidade que você sente'
    },
    {
      image: 'https://conceito.de/wp-content/uploads/2015/01/food-3181717_1280.jpg',
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


  ngOnDestroy(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }



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



  abrirModal() { 
    this.modalAberto = true;
    

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


    const itensParaAPI = selecionados.map(item => ({
      id: item.insumo.id,
      quantidade_usada: item.gramasPorPastel * this.quantidadePasteis 
    }));


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