import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ClientesService, Cliente } from '../core/services/clientes.service';

@Component({
  selector: 'app-lista-clientes',
  imports: [RouterLink, TableModule, TagModule, ButtonModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './lista-clientes.html',
})
export class ListaClientesComponent implements OnInit {
  private clientesService = inject(ClientesService);
  private confirmationService = inject(ConfirmationService);

  clientes = signal<Cliente[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.cargarClientes();
  }

  cargarClientes() {
    this.loading.set(true);
    this.clientesService.listar().subscribe({
      next: data => {
        this.clientes.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  confirmarBaja(cliente: Cliente) {
    this.confirmationService.confirm({
      message: `¿Dar de baja al cliente "${cliente.nombre}"?`,
      header: 'Confirmar baja',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Dar de baja',
      rejectLabel: 'Cancelar',
      accept: () => this.darDeBaja(cliente.id),
    });
  }

  private darDeBaja(id: number) {
    this.clientesService.actualizar(id, { estado: 'BAJA' }).subscribe({
      next: () => this.cargarClientes(),
    });
  }

  reactivar(id: number) {
    this.clientesService.actualizar(id, { estado: 'ACTIVO' }).subscribe({
      next: () => this.cargarClientes(),
    });
  }

  severidadEstado(estado: string): 'success' | 'danger' {
    return estado === 'ACTIVO' ? 'success' : 'danger';
  }
}
