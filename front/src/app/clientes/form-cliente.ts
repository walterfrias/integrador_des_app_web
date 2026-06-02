import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select'; 
import { TableModule } from 'primeng/table'; 
import { ClientesService, CreateClientePayload, UpdateClientePayload, Contacto, CreateContactoPayload, UpdateContactoPayload } from '../core/services/clientes.service'; // <-- MODIFICADO

@Component({
  selector: 'app-form-cliente',
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, SelectModule, TableModule, RouterLink], 
  templateUrl: './form-cliente.html',
})
export class FormClienteComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private clientesService = inject(ClientesService);

  id: number | null = null;
  loading = signal(false);
  guardando = signal(false);
  errorMessage = signal('');

  contactos = signal<Contacto[]>([]);
  guardandoContacto = signal(false);

  tiposContacto = [
    { label: 'Teléfono', value: 'TELEFONO' },
    { label: 'Email', value: 'EMAIL' }
  ];

  contactoForm = this.fb.group({
    id: [null as number | null],
    tipo: ['TELEFONO' as 'TELEFONO' | 'EMAIL', Validators.required],
    valor: ['', Validators.required],
    observacion: [''],
  });

  form = this.fb.group({
    nombre: ['', Validators.required],
    cuit: [''],
    direccion: [''],
  });

  get esEdicion(): boolean {
    return this.id !== null;
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
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
        
        if (cliente.contactos) {
          this.contactos.set(cliente.contactos);
        }
  
        
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
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

  prepararEdicionContacto(contacto: Contacto) {
    this.contactoForm.patchValue({
      id: contacto.id,
      tipo: contacto.tipo,
      valor: contacto.valor,
      observacion: contacto.observacion ?? ''
    });
  }

  cancelarEdicionContacto() {
    this.contactoForm.reset({ id: null, tipo: 'TELEFONO', valor: '', observacion: '' });
  }

  guardarContacto() {
    
    if (this.contactoForm.invalid || !this.id) return;

    this.guardandoContacto.set(true);
    const { id, tipo, valor, observacion } = this.contactoForm.value;

    if (id) {
      const payload: UpdateContactoPayload = { tipo: tipo as any, valor: valor! };
      if (observacion) payload.observacion = observacion;

      this.clientesService.modificarContacto(id, payload).subscribe({
        next: () => {
          this.contactos.update(ctxs => ctxs.map(c => c.id === id ? { ...c, tipo: tipo as any, valor: valor!, observacion: observacion || null } : c));
          this.cancelarEdicionContacto();
          this.guardandoContacto.set(false);
        },
        error: () => this.guardandoContacto.set(false)
      });
    } else {
      const payload: CreateContactoPayload = { tipo: tipo as any, valor: valor! };
      if (observacion) payload.observacion = observacion;

      this.clientesService.agregarContacto(this.id, payload).subscribe({
        next: (res) => {
          this.contactos.update(ctxs => [...ctxs, { id: res.id, tipo: tipo as any, valor: valor!, observacion: observacion || null }]);
          this.cancelarEdicionContacto();
          this.guardandoContacto.set(false);
        },
        error: () => this.guardandoContacto.set(false)
      });
    }
  }

  eliminarContacto(id: number) {
    if (!confirm('¿Estás seguro de eliminar este contacto?')) return;
    this.clientesService.eliminarContacto(id).subscribe({
      next: () => {
        this.contactos.update(ctxs => ctxs.filter(c => c.id !== id));
      }
    });
  }
}