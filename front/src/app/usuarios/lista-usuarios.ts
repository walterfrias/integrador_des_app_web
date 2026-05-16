import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { UsuariosService, Usuario } from '../core/services/usuarios.service';

@Component({
  selector: 'app-lista-usuarios',
  imports: [RouterLink, TableModule, TagModule, ButtonModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './lista-usuarios.html',
})
export class ListaUsuariosComponent implements OnInit {
  private usuariosService = inject(UsuariosService);
  private confirmationService = inject(ConfirmationService);

  usuarios = signal<Usuario[]>([]);
  loading = signal(true);

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
      accept: () => this.darDeBaja(usuario.id),
    });
  }

  private darDeBaja(id: number) {
    this.usuariosService.darDeBaja(id).subscribe({
      next: () => this.cargarUsuarios(),
    });
  }

  reactivar(id: number) {
    this.usuariosService.actualizar(id, { estado: 'ACTIVO' }).subscribe({
      next: () => this.cargarUsuarios(),
    });
  }

  severidadEstado(estado: string): 'success' | 'danger' {
    return estado === 'ACTIVO' ? 'success' : 'danger';
  }
}
