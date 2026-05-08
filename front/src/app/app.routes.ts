import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then(m => m.LoginComponent),
  },
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/main-layout/main-layout').then(m => m.MainLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard').then(m => m.DashboardComponent),
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./usuarios/lista-usuarios').then(m => m.ListaUsuariosComponent),
      },
      {
        path: 'usuarios/nuevo',
        loadComponent: () => import('./usuarios/form-usuario').then(m => m.FormUsuarioComponent),
      },
      {
        path: 'usuarios/:id/editar',
        loadComponent: () => import('./usuarios/form-usuario').then(m => m.FormUsuarioComponent),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
