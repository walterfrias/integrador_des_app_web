import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { AuthService } from '../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  adminOnly?: boolean;
}

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgClass],
  templateUrl: './main-layout.html',
})
export class MainLayoutComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  sidebarCollapsed = signal(false);
  mobileMenuOpen = signal(false);
  darkMode = signal(localStorage.getItem('darkMode') === 'true');

  readonly usuario = this.auth.getUsuario();
  readonly iniciales = this.usuario?.nombre
    ? this.usuario.nombre.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', route: '/app/dashboard' },
    { label: 'Proyectos', icon: 'pi pi-briefcase', route: '/app/proyectos' },
    { label: 'Clientes', icon: 'pi pi-users', route: '/app/clientes' },
    { label: 'Usuarios', icon: 'pi pi-user', route: '/app/usuarios', adminOnly: true },
    { label: 'Tareas', icon: 'pi pi-list-check', route: '/app/tareas' },
    { label: 'Mis tareas', icon: 'pi pi-check-square', route: '/app/mis-tareas' }
  ];

  get navItemsVisibles(): NavItem[] {
    return this.navItems.filter(item => !item.adminOnly || this.usuario?.rol === 'ADMIN');
  }

  toggleSidebar() {
    this.sidebarCollapsed.update(v => !v);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  toggleDarkMode() {
    this.darkMode.update(v => !v);
    document.documentElement.classList.toggle('dark', this.darkMode());
    localStorage.setItem('darkMode', String(this.darkMode()));
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
