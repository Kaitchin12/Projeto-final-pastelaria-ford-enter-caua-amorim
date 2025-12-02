import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { HomeComponent } from './components/home/home.component';
import { HistoricoComponent } from './components/historico/historico.component';
import { LucroComponent } from './components/lucro/lucro.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'cadastro',
        component: CadastroComponent
    },
    {
        path: 'home',
        component : HomeComponent
    },
    {
    path : 'historico',
    component : HistoricoComponent
    },
    {
        path : 'lucro',
        component : LucroComponent
    }
];
