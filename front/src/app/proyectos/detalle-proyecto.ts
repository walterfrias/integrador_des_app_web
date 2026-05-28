import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ProyectosService, ProyectoDTO } from '../core/services/proyectos.service';
import { TareasService } from '../core/services/tareas.service';

@Component({
    selector: 'app-detalle-proyecto',
    imports: [
        RouterLink, DatePipe,
        TableModule, TagModule, ButtonModule, DialogModule, TooltipModule, InputTextModule, SelectModule,
        ReactiveFormsModule, ConfirmDialogModule,
    ],
    providers: [ConfirmationService],
    templateUrl: './detalle-proyecto.html',
})
export class DetalleProyectoComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private proyectosService = inject(ProyectosService);
    private tareasService = inject(TareasService);
    private fb = inject(FormBuilder);
    private confirmationService = inject(ConfirmationService);
    private router = inject(Router);

    proyecto = signal<ProyectoDTO | null>(null);
    loading = signal(true);


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
    ];

    ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (!id) { this.router.navigate(['/app/proyectos']); return; }
        this.cargar(id);
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

        request$.subscribe({
            next: () => {
                this.dialogTarea.set(false);
                this.guardandoTarea.set(false);
                this.cargar(proyectoId);
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
            accept: () => {
                this.tareasService.eliminarTarea(this.proyecto()!.id, tarea.id).subscribe({
                    next: () => this.cargar(this.proyecto()!.id),
                    error: () => console.error('Error al eliminar tarea'),
                });
            },
        });
    }

    cambiarEstado(tarea: any, nuevoEstado: string) {
        this.tareasService.actualizarTarea(this.proyecto()!.id, tarea.id, {
            descripcion: tarea.descripcion,
            estado: nuevoEstado,
        }).subscribe({
            next: () => this.cargar(this.proyecto()!.id),
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
}