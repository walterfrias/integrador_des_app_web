import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import {
  ClientesService,
  Contacto,
  ContactoPayload,
  CreateClientePayload,
  UpdateClientePayload,
} from '../core/services/clientes.service';

@Component({
  selector: 'app-form-cliente',
  imports: [
    ReactiveFormsModule, FormsModule, RouterLink,
    ButtonModule, InputTextModule, InputMaskModule, SelectModule, DialogModule,
    TagModule, TooltipModule, ConfirmDialogModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './form-cliente.html',
})
export class FormClienteComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private clientesService = inject(ClientesService);
  private confirmationService = inject(ConfirmationService);

  id: number | null = null;
  loading = signal(false);
  guardando = signal(false);
  errorMessage = signal('');

  contactos = signal<Contacto[]>([]);
  dialogContacto = signal(false);
  contactoEditando = signal<Contacto | null>(null);
  guardandoContacto = signal(false);

  readonly tiposContacto = [
    { label: 'Teléfono', value: 'TELEFONO' },
    { label: 'Email', value: 'EMAIL' },
  ];

  readonly CUIT_PATTERN = /^\d{2}-\d{6}-\d{2}$/;

  form = this.fb.group({
    nombre: ['', Validators.required],
    cuit: ['', Validators.pattern(/^\d{2}-\d{6}-\d{2}$/)],
    direccion: [''],
  });

  formContacto = this.fb.group({
    tipo: ['TELEFONO', Validators.required],
    valor: ['', Validators.required],
    observacion: [''],
  });

  get tipoContactoActual(): string {
    return this.formContacto.get('tipo')?.value ?? 'TELEFONO';
  }

  get esEdicion(): boolean {
    return this.id !== null;
  }

  private actualizarValidadoresTipo(tipo: string) {
    const ctrl = this.formContacto.get('valor')!;
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    const telRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

    ctrl.setValidators(tipo === 'EMAIL'
      ? [Validators.required, Validators.pattern(emailRegex)]
      : [Validators.required, Validators.pattern(telRegex)]
    );
    
    ctrl.updateValueAndValidity();
  }

  ngOnInit() {
    this.formContacto.get('tipo')!.valueChanges.subscribe(tipo => {
      this.actualizarValidadoresTipo(tipo ?? 'TELEFONO');
    });
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (!idParam) return;

      this.id = +idParam;
      this.loading.set(true);

      this.clientesService.obtenerPorId(this.id).subscribe({
        next: cliente => {
          this.form.patchValue({
            nombre: cliente.nombre,
            cuit: cliente.cuit ?? '',
            direccion: cliente.direccion ?? '',
          });
          this.contactos.set(cliente.contactos ?? []);
          this.loading.set(false);
        },
        error: () => {
          this.errorMessage.set('No se pudo cargar el cliente');
          this.loading.set(false);
        },
      });
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.guardando.set(true);
    this.errorMessage.set('');
    const { nombre, cuit, direccion } = this.form.value;

    if (this.esEdicion) {
      const data: UpdateClientePayload = { nombre: nombre! };
      if (cuit) data.cuit = cuit;
      if (direccion) data.direccion = direccion;
      this.clientesService.actualizar(this.id!, data).subscribe({
        next: () => this.router.navigate(['/app/clientes']),
        error: () => {
          this.errorMessage.set('Error al actualizar el cliente');
          this.guardando.set(false);
        },
      });
    } else {
      const data: CreateClientePayload = { nombre: nombre! };
      if (cuit) data.cuit = cuit;
      if (direccion) data.direccion = direccion;
      this.clientesService.crear(data).subscribe({
        next: () => this.router.navigate(['/app/clientes']),
        error: () => {
          this.errorMessage.set('Error al crear el cliente. Verificá que el nombre o CUIT no estén en uso.');
          this.guardando.set(false);
        },
      });
    }
  }

  abrirNuevoContacto() {
    this.contactoEditando.set(null);
    this.formContacto.reset({ tipo: 'TELEFONO', valor: '', observacion: '' });
    this.actualizarValidadoresTipo('TELEFONO');
    this.dialogContacto.set(true);
  }

  abrirEditarContacto(c: Contacto) {
    this.contactoEditando.set(c);
    this.formContacto.patchValue({ tipo: c.tipo, valor: c.valor, observacion: c.observacion ?? '' });
    this.actualizarValidadoresTipo(c.tipo);
    this.dialogContacto.set(true);
  }

  guardarContacto() {
    if (this.formContacto.invalid) return;
    this.guardandoContacto.set(true);
    const { tipo, valor, observacion } = this.formContacto.value;
    const data: ContactoPayload = { tipo: tipo!, valor: valor! };
    if (observacion) data.observacion = observacion;

    const ok = () => {
      this.dialogContacto.set(false);
      this.guardandoContacto.set(false);
      this.recargarContactos();
    };
    const err = () => this.guardandoContacto.set(false);

    const editando = this.contactoEditando();
    if (editando) {
      this.clientesService.modificarContacto(editando.id, data).subscribe({ next: ok, error: err });
    } else {
      this.clientesService.agregarContacto(this.id!, data).subscribe({ next: ok, error: err });
    }
  }

  confirmarEliminarContacto(c: Contacto) {
    this.confirmationService.confirm({
      message: `¿Eliminar el contacto "${c.valor}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.clientesService.eliminarContacto(c.id).subscribe({
          next: () => this.recargarContactos(),
        });
      },
    });
  }

  private recargarContactos() {
    this.clientesService.obtenerPorId(this.id!).subscribe({
      next: c => this.contactos.set(c.contactos ?? []),
    });
  }

  severidadTipo(tipo: string): 'info' | 'success' {
    return tipo === 'EMAIL' ? 'success' : 'info';
  }
}
