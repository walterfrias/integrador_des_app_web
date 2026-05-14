import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ClientesService, CreateClientePayload, UpdateClientePayload } from '../core/services/clientes.service';

@Component({
  selector: 'app-form-cliente',
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, RouterLink],
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
}
