import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { UsuariosService, Usuario } from '../core/services/usuarios.service';

@Component({
  selector: 'app-lista-usuarios',
  imports: [RouterLink, TableModule, TagModule, ButtonModule, ConfirmDialogModule, TooltipModule, ToastModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './lista-usuarios.html',
})
export class ListaUsuariosComponent implements OnInit {
  private usuariosService = inject(UsuariosService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  usuarios = signal<Usuario[]>([]);
  loading = signal(true);
  busqueda = signal('');
  filtroRol = signal('TODOS');
  filtroEstado = signal('TODOS');

  usuariosFiltrados = computed(() => {
    const q = this.busqueda().toLowerCase().trim();
    const rol = this.filtroRol();
    const estado = this.filtroEstado();
    return this.usuarios().filter(u => {
      const matchRol = rol === 'TODOS' || u.rol === rol;
      const matchEstado = estado === 'TODOS' || u.estado === estado;
      const matchQ = !q
        || u.nombre.toLowerCase().includes(q)
        || (u.apellido ?? '').toLowerCase().includes(q)
        || (u.email ?? '').toLowerCase().includes(q)
        || (u.cuil ?? '').toLowerCase().includes(q);
      return matchRol && matchEstado && matchQ;
    });
  });

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.loading.set(true);
    this.usuariosService.listar().subscribe({
      next: data => {
        this.usuarios.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  confirmarBaja(usuario: Usuario) {
    this.confirmationService.confirm({
      message: `¿Dar de baja al usuario "${usuario.nombre}"?`,
      header: 'Confirmar baja',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Dar de baja',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger p-button-outlined',
      rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
      accept: () => this.darDeBaja(usuario.id),
    });
  }

  private darDeBaja(id: number) {
    this.usuariosService.darDeBaja(id).subscribe({
      next: () => {
        this.cargarUsuarios();
        this.messageService.add({ severity: 'warn', summary: 'Baja registrada', detail: 'El usuario fue dado de baja.', life: 3000 });
      },
    });
  }

  reactivar(id: number) {
    this.usuariosService.actualizar(id, { estado: 'ACTIVO' }).subscribe({
      next: () => {
        this.cargarUsuarios();
        this.messageService.add({ severity: 'success', summary: 'Usuario reactivado', detail: 'El usuario fue reactivado exitosamente.', life: 3000 });
      },
    });
  }

  severidadEstado(estado: string): 'success' | 'danger' {
    return estado === 'ACTIVO' ? 'success' : 'danger';
  }
}
