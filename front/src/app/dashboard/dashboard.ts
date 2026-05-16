import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

interface ModuloCard {
  label: string;
  descripcion: string;
  icon: string;
  route: string;
  color: string;
  adminOnly?: boolean;
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
})
export class DashboardComponent {
  private auth = inject(AuthService);

  usuario = this.auth.getUsuario();

  modulos: ModuloCard[] = [
    {
      label: 'Proyectos',
      descripcion: 'Gestioná los proyectos del equipo',
      icon: 'pi pi-briefcase',
      route: '/app/proyectos',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Clientes',
      descripcion: 'Administrá la cartera de clientes',
      icon: 'pi pi-users',
      route: '/app/clientes',
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Usuarios',
      descripcion: 'Gestioná los usuarios del sistema',
      icon: 'pi pi-user',
      route: '/app/usuarios',
      color: 'bg-indigo-50 text-indigo-600',
      adminOnly: true,
    },
  ];

  get modulosVisibles(): ModuloCard[] {
    return this.modulos.filter(m => !m.adminOnly || this.usuario?.rol === 'ADMIN');
  }
}
