import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService } from 'primeng/api';
import { ClientesService, Cliente } from '../core/services/clientes.service';

@Component({
  selector: 'app-lista-clientes',
  imports: [RouterLink, TableModule, TagModule, ButtonModule, ConfirmDialogModule, TooltipModule],
  providers: [ConfirmationService],
  templateUrl: './lista-clientes.html',
})
export class ListaClientesComponent implements OnInit {
  private clientesService = inject(ClientesService);
  private confirmationService = inject(ConfirmationService);
  private route = inject(ActivatedRoute);

  clientes = signal<Cliente[]>([]);
  loading = signal(true);
  busqueda = signal('');
  filtroEstado = signal('TODOS');
  errorBaja = signal('');

  clientesFiltrados = computed(() => {
    const q = this.busqueda().toLowerCase().trim();
    const estado = this.filtroEstado();
    return this.clientes().filter(c => {
      const matchEstado = estado === 'TODOS' || c.estado === estado;
      const matchQ = !q
        || c.nombre.toLowerCase().includes(q)
        || (c.cuit ?? '').toLowerCase().includes(q)
        || (c.direccion ?? '').toLowerCase().includes(q);
      return matchEstado && matchQ;
    });
  });

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['busqueda']) {
        this.busqueda.set(params['busqueda']);
      }
    });
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
    this.errorBaja.set('');
    this.clientesService.actualizar(id, { estado: 'BAJA' }).subscribe({
      next: () => this.cargarClientes(),
      error: (err) => {
        this.errorBaja.set(err.error?.message || 'Error al dar de baja el cliente');
      },
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
