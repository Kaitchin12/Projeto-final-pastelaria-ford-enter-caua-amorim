import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../../../models/usuario.model';

@Component({
  selector: 'app-cadastro',
 standalone: true,
imports: [FormsModule],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})

export class CadastroComponent {
  usuario: Usuario = { nome: '', email: '', senha: '' };

  constructor(private auth: AuthService, private router: Router) {}

  cadastrar() {
    this.auth.cadastrar(this.usuario).subscribe({
      next: () => {
        alert('Cadastro realizado com sucesso');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert(err?.error?.message || 'Erro ao cadastrar');
      }
    });
  }
}