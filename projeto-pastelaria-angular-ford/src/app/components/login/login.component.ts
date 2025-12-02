  import { Component } from '@angular/core';
  import { FormsModule } from '@angular/forms';
  import { Router } from '@angular/router';
  import { AuthService } from '../../services/auth.service';
  import { Usuario } from '../../../../models/usuario.model';
  import { LoginResponse } from '../../../../models/login-response.model';

  @Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
  })
  export class LoginComponent {

    usuario: Usuario = {
      email: '',
      senha: ''
    };

    constructor(
      private auth: AuthService,
      private router: Router
    ) {}

    entrar() {
      this.auth.login(this.usuario).subscribe({
        next: (res: LoginResponse) => {

          // ✅ Só permite navegação se success for TRUE
          if (res && res.success === true) {
            localStorage.setItem('usuario', JSON.stringify(res.usuario));
            this.router.navigate(['/home']);
          } else {
            alert(res?.message || 'Email ou senha inválidos');
          }

        },
        error: (err) => {
          const msg = err?.error?.message || 'Email ou senha inválidos';
          alert(msg);
        }
      });
    }
  }
