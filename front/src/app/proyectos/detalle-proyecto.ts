import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProyectosService, ProyectoDTO } from '../core/services/proyectos.service';
import { TareasService } from '../core/services/tareas.service';
import { UsuariosService, Usuario } from '../core/services/usuarios.service';

@Component({
    selector: 'app-detalle-proyecto',
    imports: [
        RouterLink, DatePipe, NgClass,
        TagModule, ButtonModule, DialogModule, TooltipModule, InputTextModule, SelectModule,
        ReactiveFormsModule, ConfirmDialogModule, ToastModule,
    ],
    providers: [ConfirmationService, MessageService],
    templateUrl: './detalle-proyecto.html',
})
export class DetalleProyectoComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private proyectosService = inject(ProyectosService);
    private tareasService = inject(TareasService);
    private usuariosService = inject(UsuariosService);
    private fb = inject(FormBuilder);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);
    private router = inject(Router);

    proyecto = signal<ProyectoDTO | null>(null);
    loading = signal(true);

    usuariosActivos = signal<Usuario[]>([]);
    dialogResponsable = signal(false);
    tareaParaResponsable = signal<any>(null);


    dialogTarea = signal(false);
    tareaEditando: any = null;
    formTarea = this.fb.group({
        descripcion: ['', Validators.required],
        estado: ['PENDIENTE'],
    });
    guardandoTarea = signal(false);
    errorTarea = signal('');

    estadosTarea = [
        { label: 'Pendiente', value: 'PENDIENTE' },
        { label: 'Finalizada', value: 'FINALIZADA' },
        { label: 'Baja', value: 'BAJA' },
    ];

    filtroEstado = signal('TODOS');
    filtroResponsable = signal('TODOS');

    private readonly PALETA = ['bg-indigo-500', 'bg-violet-500', 'bg-sky-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'];

    responsablesEnProyecto = computed(() => {
        const lista: { id: string; nombreCompleto: string; iniciales: string; color: string }[] = [];
        const seen = new Set<string>();
        let idx = 0;
        (this.proyecto()?.tareas ?? []).forEach(t => {
            if (t.responsable) {
                const key = String(t.responsable.id);
                if (!seen.has(key)) {
                    seen.add(key);
                    const n = t.responsable.nombre ?? '';
                    const a = t.responsable.apellido ?? '';
                    lista.push({
                        id: key,
                        nombreCompleto: [n, a].filter(Boolean).join(' '),
                        iniciales: ((n[0] ?? '') + (a[0] ?? '')).toUpperCase() || '?',
                        color: this.PALETA[idx++ % this.PALETA.length],
                    });
                }
            }
        });
        return lista;
    });

    private mapaColoresResp = computed(() => {
        const m = new Map<string, string>();
        this.responsablesEnProyecto().forEach(r => m.set(r.id, r.color));
        return m;
    });

    tieneTareasSinResponsable = computed(() =>
        (this.proyecto()?.tareas ?? []).some(t => !t.responsable)
    );

    tareasFiltradas = computed(() => {
        const resp = this.filtroResponsable();
        const tareas = this.proyecto()?.tareas ?? [];
        if (resp === 'TODOS') return tareas;
        if (resp === 'SIN_ASIGNAR') return tareas.filter(t => !t.responsable);
        return tareas.filter(t => t.responsable && String(t.responsable.id) === resp);
    });

    tareasPorEstado = computed(() => {
        const mapa: Record<string, any[]> = { PENDIENTE: [], FINALIZADA: [], BAJA: [] };
        this.tareasFiltradas().forEach(t => { if (mapa[t.estado]) mapa[t.estado].push(t); });
        return mapa;
    });

    ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (!id) { this.router.navigate(['/app/proyectos']); return; }
        this.cargar(id);
        this.usuariosService.listar().subscribe({
            next: (lista) => this.usuariosActivos.set(lista.filter(u => u.estado === 'ACTIVO')),
        });
    }

    private cargar(id: number) {
        this.loading.set(true);
        this.proyectosService.obtenerPorId(id).subscribe({
            next: (data) => { this.proyecto.set(data); this.loading.set(false); },
            error: () => { this.loading.set(false); this.router.navigate(['/app/proyectos']); },
        });
    }

    abrirNuevaTarea() {
        this.tareaEditando = null;
        this.formTarea.reset({ descripcion: '', estado: 'PENDIENTE' });
        this.errorTarea.set('');
        this.dialogTarea.set(true);
    }

    abrirEditarTarea(tarea: any) {
        this.tareaEditando = tarea;
        this.formTarea.patchValue({ descripcion: tarea.descripcion, estado: tarea.estado });
        this.errorTarea.set('');
        this.dialogTarea.set(true);
    }

    guardarTarea() {
        if (this.formTarea.invalid) return;
        this.guardandoTarea.set(true);
        this.errorTarea.set('');
        const { descripcion, estado } = this.formTarea.value;
        const proyectoId = this.proyecto()!.id;

        const request$ = this.tareaEditando
            ? this.tareasService.actualizarTarea(proyectoId, this.tareaEditando.id, { descripcion, estado })
            : this.tareasService.crearTarea(proyectoId, { descripcion: descripcion! });

        const esNueva = !this.tareaEditando;
        request$.subscribe({
            next: (tareaActualizada: any) => {
                this.dialogTarea.set(false);
                this.guardandoTarea.set(false);
                if (esNueva) {
                    this.proyecto.update(p => p ? { ...p, tareas: [...p.tareas, tareaActualizada] } : p);
                    this.messageService.add({ severity: 'success', summary: 'Tarea creada', detail: `"${tareaActualizada.descripcion}" fue agregada al proyecto.`, life: 3000 });
                } else {
                    this.proyecto.update(p => p ? { ...p, tareas: p.tareas.map(t => t.id === tareaActualizada.id ? tareaActualizada : t) } : p);
                    this.messageService.add({ severity: 'success', summary: 'Tarea actualizada', detail: `"${tareaActualizada.descripcion}" fue actualizada.`, life: 3000 });
                }
            },
            error: () => {
                this.errorTarea.set('Error al guardar la tarea');
                this.guardandoTarea.set(false);
            },
        });
    }

    confirmarEliminarTarea(tarea: any) {
        this.confirmationService.confirm({
            message: `¿Eliminar la tarea "${tarea.descripcion}"?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Eliminar',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger p-button-outlined',
            rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
            accept: () => {
                this.tareasService.eliminarTarea(this.proyecto()!.id, tarea.id).subscribe({
                    next: () => {
                        this.proyecto.update(p => p ? { ...p, tareas: p.tareas.filter(t => t.id !== tarea.id) } : p);
                        this.messageService.add({ severity: 'warn', summary: 'Tarea eliminada', detail: `"${tarea.descripcion}" fue eliminada.`, life: 3000 });
                    },
                    error: () => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la tarea.', life: 4000 });
                    },
                });
            },
        });
    }

    cambiarEstado(tarea: any, nuevoEstado: string) {
        if (nuevoEstado === 'BAJA') {
            this.confirmationService.confirm({
                message: `¿Dar de baja la tarea "${tarea.descripcion}"?`,
                header: 'Confirmar baja',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Dar de baja',
                rejectLabel: 'Cancelar',
                acceptButtonStyleClass: 'p-button-danger p-button-outlined',
                rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
                accept: () => this.ejecutarCambioEstado(tarea, nuevoEstado),
            });
            return;
        }
        this.ejecutarCambioEstado(tarea, nuevoEstado);
    }

    private ejecutarCambioEstado(tarea: any, nuevoEstado: string) {
        this.tareasService.actualizarTarea(this.proyecto()!.id, tarea.id, {
            descripcion: tarea.descripcion,
            estado: nuevoEstado,
        }).subscribe({
            next: (tareaActualizada: any) => {
                this.proyecto.update(p => p ? { ...p, tareas: p.tareas.map(t => t.id === tareaActualizada.id ? tareaActualizada : t) } : p);
                if (nuevoEstado === 'BAJA') {
                    this.messageService.add({ severity: 'warn', summary: 'Tarea dada de baja', detail: `"${tarea.descripcion}" fue dada de baja.`, life: 3000 });
                }
            },
            error: () => console.error('Error al cambiar estado'),
        });
    }

    severidadEstado(estado: string): 'success' | 'info' | 'danger' | 'warn' {
        switch (estado) {
            case 'ACTIVO': return 'success';
            case 'FINALIZADO': case 'FINALIZADA': return 'info';
            case 'BAJA': return 'danger';
            case 'PENDIENTE': return 'warn';
            default: return 'warn';
        }
    }

    abrirAsignarResponsable(tarea: any) {
        this.tareaParaResponsable.set(tarea);
        this.dialogResponsable.set(true);
    }

    asignarResponsable(usuario: Usuario) {
        const tarea = this.tareaParaResponsable();
        if (!tarea) return;
        const idProyecto = this.proyecto()!.id;
        this.tareasService.asignarResponsable(idProyecto, tarea.id, usuario.id).subscribe({
            next: (tareaActualizada: any) => {
                this.dialogResponsable.set(false);
                this.proyecto.update(p => p ? { ...p, tareas: p.tareas.map(t => t.id === tareaActualizada.id ? tareaActualizada : t) } : p);
            },
        });
    }

    quitarResponsable() {
        const tarea = this.tareaParaResponsable();
        if (!tarea) return;
        const idProyecto = this.proyecto()!.id;
        this.tareasService.quitarResponsable(idProyecto, tarea.id).subscribe({
            next: (tareaActualizada: any) => {
                this.dialogResponsable.set(false);
                this.proyecto.update(p => p ? { ...p, tareas: p.tareas.map(t => t.id === tareaActualizada.id ? tareaActualizada : t) } : p);
            },
        });
    }

    iniciales(u: Usuario): string {
        return ((u.nombre[0] ?? '') + (u.apellido?.[0] ?? '')).toUpperCase() || '?';
    }

    colorRespId(id: string): string {
        return this.mapaColoresResp().get(id) ?? 'bg-slate-400';
    }

    exportarTareasCSV() {
        const proyecto = this.proyecto();
        if (!proyecto) return;
        const encabezado = ['Descripción', 'Estado', 'Responsable', 'Fecha creación'];
        const filas = this.tareasFiltradas().map(t => [
            t.descripcion,
            t.estado,
            t.responsable
                ? `${t.responsable.nombre} ${t.responsable.apellido ?? ''}`.trim()
                : 'Sin asignar',
            new Date(t.fechaCreacion).toLocaleDateString('es-AR'),
        ]);
        this.descargarCSV([encabezado, ...filas], `tareas-${proyecto.nombre}.csv`);
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