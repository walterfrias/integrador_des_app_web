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

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', route: '/app/dashboard' },
    { label: 'Proyectos', icon: 'pi pi-briefcase', route: '/app/proyectos' },
    { label: 'Clientes', icon: 'pi pi-users', route: '/app/clientes' },
    { label: 'Usuarios', icon: 'pi pi-user', route: '/app/usuarios', adminOnly: true },
    { label: 'Tareas', icon: 'pi pi-check-square', route: '/app/mis-tareas', adminOnly: false }
  ];

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
