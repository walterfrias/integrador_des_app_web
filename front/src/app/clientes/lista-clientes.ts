import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ClientesService, Cliente } from '../core/services/clientes.service';

@Component({
  selector: 'app-lista-clientes',
  imports: [RouterLink, TableModule, TagModule, ButtonModule, ConfirmDialogModule, TooltipModule, ToastModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './lista-clientes.html',
})
export class ListaClientesComponent implements OnInit {
  private clientesService = inject(ClientesService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
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
      acceptButtonStyleClass: 'p-button-danger p-button-outlined',
      rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
      accept: () => this.darDeBaja(cliente.id),
    });
  }

  private darDeBaja(id: number) {
    this.errorBaja.set('');
    this.clientesService.actualizar(id, { estado: 'BAJA' }).subscribe({
      next: () => {
        this.cargarClientes();
        this.messageService.add({ severity: 'warn', summary: 'Baja registrada', detail: 'El cliente fue dado de baja.', life: 3000 });
      },
      error: (err) => {
        this.errorBaja.set(err.error?.message || 'Error al dar de baja el cliente');
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'No se pudo dar de baja el cliente.', life: 4000 });
      },
    });
  }

  reactivar(id: number) {
    this.clientesService.actualizar(id, { estado: 'ACTIVO' }).subscribe({
      next: () => {
        this.cargarClientes();
        this.messageService.add({ severity: 'success', summary: 'Cliente reactivado', detail: 'El cliente fue reactivado exitosamente.', life: 3000 });
      },
    });
  }

  severidadEstado(estado: string): 'success' | 'danger' {
    return estado === 'ACTIVO' ? 'success' : 'danger';
  }
}
