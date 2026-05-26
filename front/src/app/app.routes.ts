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
    loadComponent: () => import('./layout/main-layout').then(m => m.MainLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard').then(m => m.DashboardComponent),
      },
      {
        path: 'clientes',
        loadComponent: () => import('./clientes/lista-clientes').then(m => m.ListaClientesComponent),
      },
      {
        path: 'clientes/nuevo',
        loadComponent: () => import('./clientes/form-cliente').then(m => m.FormClienteComponent),
      },
      {
        path: 'clientes/:id/editar',
        loadComponent: () => import('./clientes/form-cliente').then(m => m.FormClienteComponent),
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
        path: 'usuarios/:id/detalle',
        loadComponent: () => import('./usuarios/detalle-usuario').then(m => m.DetalleUsuarioComponent),
      },
      {
        path: 'proyectos',
        loadComponent: () => import('./proyectos/lista-proyectos').then(m => m.ListaProyectosComponent),
      },
      {
        path: 'proyectos/nuevo',
        loadComponent: () => import('./proyectos/form-proyecto').then(m => m.FormProyectoComponent),
      },
      {
        path: 'proyectos/:id/editar',
        loadComponent: () => import('./proyectos/form-proyecto').then(m => m.FormProyectoComponent),
      },
      {
        path: 'mis-tareas',
        loadComponent: () => 
          import('./tareas-proyecto/tareas-proyecto.component').then((m) => m.TareasProyectoComponent),
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
