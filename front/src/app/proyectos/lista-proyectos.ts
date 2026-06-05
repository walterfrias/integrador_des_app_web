import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProyectosService, ListProyectoDTO } from '../core/services/proyectos.service';

@Component({
    selector: 'app-lista-proyectos',
    imports: [
        RouterLink, DatePipe,
        TableModule, TagModule, ButtonModule, TooltipModule, ConfirmDialogModule, ToastModule,
    ],
    providers: [ConfirmationService, MessageService],
    templateUrl: './lista-proyectos.html',
    styles: [`
        @keyframes glow-pulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
            50% { box-shadow: 0 0 8px 3px rgba(34,197,94,0.45); }
        }
        .badge-prioritario { animation: glow-pulse 1.8s ease-in-out infinite; }
    `],
})

export class ListaProyectosComponent implements OnInit {
    private proyectosService = inject(ProyectosService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);
    proyectos = signal<ListProyectoDTO[]>([]);
    loading = signal(true);
    filtroEstado = signal<string>('TODOS');
    busqueda = signal('');
    proyectosFiltrados = computed(() => {
        const lista = this.proyectos();
        const estado = this.filtroEstado();
        const q = this.busqueda().toLowerCase().trim();
        return lista.filter((p) => {
            if (estado === 'ATRASADO') {
                if (!p.retraso) return false;
            } else if (estado !== 'TODOS' && p.estado !== estado) return false;
            if (q) {
                const nombre = p.nombre.toLowerCase();
                const cliente = p.cliente?.nombre.toLowerCase() ?? '';
                if (!nombre.includes(q) && !cliente.includes(q)) return false;
            }
            return true;
        });
    });
    readonly estados = ['TODOS', 'ACTIVO', 'ATRASADO', 'FINALIZADO', 'BAJA'];
    ngOnInit() { this.cargarProyectos(); }
    cargarProyectos() {
        this.loading.set(true);
        this.proyectosService.listar().subscribe({
            next: (data) => { this.proyectos.set(data); this.loading.set(false); },
            error: () => this.loading.set(false),
        });
    }
    confirmarBaja(proyecto: ListProyectoDTO) {
        this.confirmationService.confirm({
            message: `¿Dar de baja al proyecto "${proyecto.nombre}"?`,
            header: 'Confirmar baja',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Dar de baja',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger p-button-outlined',
            rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
            accept: () => this.actualizarEstado(proyecto.id, 'BAJA', 'warn', 'Baja registrada', `"${proyecto.nombre}" fue dado de baja.`),
        });
    }
    finalizar(proyecto: ListProyectoDTO) { this.actualizarEstado(proyecto.id, 'FINALIZADO', 'info', 'Proyecto finalizado', `"${proyecto.nombre}" fue marcado como finalizado.`); }
    reactivar(proyecto: ListProyectoDTO) { this.actualizarEstado(proyecto.id, 'ACTIVO', 'success', 'Proyecto reactivado', `"${proyecto.nombre}" fue reactivado exitosamente.`); }
    private actualizarEstado(id: number, estado: 'ACTIVO' | 'FINALIZADO' | 'BAJA', severity: string, summary: string, detail: string) {
        this.proyectosService.actualizar(id, { estado }).subscribe({
            next: () => {
                this.cargarProyectos();
                this.messageService.add({ severity, summary, detail, life: 3000 } as any);
            },
        });
    }
    severidadEstado(estado: string): 'success' | 'info' | 'danger' | 'warn' {
        switch (estado) {
            case 'ACTIVO': return 'success';
            case 'FINALIZADO': return 'info';
            case 'BAJA': return 'danger';
            default: return 'warn';
        }
    }

    esPrioridad(proyecto: ListProyectoDTO, idx: number): boolean {
        if (idx >= 3 || !proyecto.fechaLimite) return false;
        const hoy = new Date();
        const fecha = new Date(proyecto.fechaLimite);
        return fecha.getFullYear() === hoy.getFullYear() && fecha.getMonth() === hoy.getMonth();
    }

    exportarCSV() {
        const encabezado = ['Nombre', 'Estado', 'Cliente', 'Fecha límite', 'Atrasado'];
        const filas = this.proyectosFiltrados().map(p => [
            p.nombre,
            p.estado,
            p.cliente?.nombre ?? '—',
            p.fechaLimite ? new Date(p.fechaLimite).toLocaleDateString('es-AR') : '—',
            p.retraso ? 'Sí' : 'No',
        ]);
        this.descargarCSV([encabezado, ...filas], 'proyectos.csv');
    }

    private descargarCSV(filas: string[][], nombre: string) {
        const contenido = filas
            .map(f => f.map(c => `"${(c ?? '').replace(/"/g, '""')}"`).join(','))
            .join('\n');
        const blob = new Blob(['﻿' + contenido], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nombre;
        a.click();
        URL.revokeObjectURL(url);
    }
}