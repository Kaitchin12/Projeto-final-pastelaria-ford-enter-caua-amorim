// import { Component, OnInit } from '@angular/core';
// import { LucroService } from '../../services/lucro.service';
// import { CommonModule } from '@angular/common'; // necessário para o pipe 'number'

// @Component({
//   selector: 'app-lucro',
//   templateUrl: './lucro.component.html',
//   styleUrls: ['./lucro.component.css'],
//   imports: [CommonModule]
// })
// export class LucroComponent implements OnInit {

//   lucroTotal: number = 0;

//   constructor(private lucroService: LucroService) {}

//   ngOnInit(): void {
//     // Inscreve no observable para receber atualizações de lucro
//     this.lucroService.lucroTotal$.subscribe(valor => {
//       this.lucroTotal = valor;
//     });

//     // Inicializa o lucro (opcional, dependendo da lógica)
//     this.lucroService.atualizarLucro();
//   }
// }

import { Component, OnInit } from '@angular/core';
import { LucroService } from '../../services/lucro.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lucro',
  templateUrl: './lucro.component.html',
  styleUrls: ['./lucro.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class LucroComponent implements OnInit {

  lucroTotal: number = 0;

  constructor(private lucroService: LucroService) {}

  ngOnInit(): void {
    // Inscreve para receber atualizações
    this.lucroService.lucroTotal$.subscribe(valor => {
      this.lucroTotal = valor;
    });

    // Pede ao service para buscar o total atualizado no banco
    this.lucroService.carregarLucroTotal();
  }
}