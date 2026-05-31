import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { ProyectosService, CreateProyectoPayload, UpdateProyectoPayload } from '../core/services/proyectos.service';
import { ClientesService } from '../core/services/clientes.service';

@Component({
    selector: 'app-form-proyecto',
    imports: [ReactiveFormsModule, ButtonModule, InputTextModule, SelectModule, DatePickerModule, RouterLink, DialogModule],
    templateUrl: './form-proyecto.html',
})
export class FormProyectoComponent implements OnInit {
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private proyectosService = inject(ProyectosService);
    private clientesService = inject(ClientesService);
    id: number | null = null;
    loading = signal(false);
    guardando = signal(false);
    errorMessage = signal('');
    clientes = signal<{ label: string; value: number }[]>([]);
    form = this.fb.group({
        nombre: ['', Validators.required],
        idCliente: [null as number | null],
        fechaLimite: [null as string | null],
        estado: ['ACTIVO'],
    });
    estados = [
        { label: 'Activo', value: 'ACTIVO' },
        { label: 'Finalizado', value: 'FINALIZADO' },
        { label: 'Baja', value: 'BAJA' },
    ];

    dialogCliente = signal(false);
    formCliente = this.fb.group({
        nombre: ['', Validators.required],
        cuit: [''],
        direccion: [''],
    });
    guardandoCliente = signal(false);
    errorCliente = signal('');

    get esEdicion(): boolean { return this.id !== null; }

    ngOnInit() {
        this.cargarClientes();
        const idParam = this.route.snapshot.paramMap.get('id');
        if (!idParam) return;
        this.id = +idParam;
        this.loading.set(true);
        this.proyectosService.obtenerPorId(this.id).subscribe({
            next: (proyecto) => {
                this.form.patchValue({
                    nombre: proyecto.nombre,
                    idCliente: proyecto.cliente?.id ?? null,
                    fechaLimite: proyecto.fechaLimite ?? null,
                    estado: proyecto.estado
                });
                this.loading.set(false);
            },
            error: () => this.loading.set(false),
        });
    }

    private cargarClientes() {
        this.clientesService.listar().subscribe((data) => {
            const lista = data.filter(c => c.estado === 'ACTIVO').map(c => ({ label: c.nombre, value: c.id }));
            lista.unshift({ label: '+ Crear nuevo cliente', value: -1 });
            this.clientes.set(lista);
        });
    }

    onClienteChange(event: any) {
        if (event.value === -1) {
            this.form.patchValue({ idCliente: null });
            this.abrirNuevoCliente();
        }
    }

    abrirNuevoCliente() {
        this.formCliente.reset({ nombre: '' });
        this.errorCliente.set('');
        this.dialogCliente.set(true);
    }

    guardarClienteRapido() {
        if (this.formCliente.invalid) return;
        this.guardandoCliente.set(true);
        this.errorCliente.set('');

        this.clientesService.crear({
            nombre: this.formCliente.value.nombre!,
            cuit: this.formCliente.value.cuit || undefined,
            direccion: this.formCliente.value.direccion || undefined,
        }).subscribe({
            next: (res) => {
                this.dialogCliente.set(false);
                this.guardandoCliente.set(false);
                this.cargarClientes();
                this.form.patchValue({ idCliente: res.id });
            },
            error: (err) => {
                this.guardandoCliente.set(false);
                this.errorCliente.set(
                    err.status === 409
                        ? 'Ya existe un cliente con ese nombre'
                        : 'Error al crear el cliente'
                );
            },
        });
    }

    onSubmit() {
        if (this.form.invalid) return;
        this.guardando.set(true);
        this.errorMessage.set('');
        const { nombre, idCliente, fechaLimite, estado } = this.form.value;
        if (this.esEdicion) {
            const data: UpdateProyectoPayload = {};
            if (nombre) data.nombre = nombre;
            if (estado) data.estado = estado as any;
            if (idCliente != null) data.idCliente = idCliente;
            if (fechaLimite) data.fechaLimite = fechaLimite;
            this.proyectosService.actualizar(this.id!, data).subscribe({
                next: () => this.router.navigate(['/app/proyectos']),
                error: () => { this.errorMessage.set('Error al actualizar'); this.guardando.set(false); },
            });
        } else {
            const data: CreateProyectoPayload = { nombre: nombre! };
            if (estado) data.estado = estado as any;
            if (idCliente != null) data.idCliente = idCliente;
            if (fechaLimite) data.fechaLimite = fechaLimite;
            this.proyectosService.crear(data).subscribe({
                next: () => this.router.navigate(['/app/proyectos']),
                error: () => { this.errorMessage.set('Error al crear. Verifica que el nombre no este en uso.'); this.guardando.set(false); },
            });
        }
    }
}