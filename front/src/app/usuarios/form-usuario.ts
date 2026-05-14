import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { UsuariosService, CreateUsuarioPayload, UpdateUsuarioPayload } from '../core/services/usuarios.service';

@Component({
  selector: 'app-form-usuario',
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, PasswordModule, SelectModule, RouterLink],
  templateUrl: './form-usuario.html',
})
export class FormUsuarioComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private usuariosService = inject(UsuariosService);

  id: number | null = null;
  loading = signal(false);
  guardando = signal(false);
  errorMessage = signal('');

  roles = [
    { label: 'Operador', value: 'OPERADOR' },
    { label: 'Administrador', value: 'ADMIN' },
  ];

  form = this.fb.group({
    nombre: ['', Validators.required],
    apellido: [''],
    email: ['', Validators.email],
    cuil: [''],
    clave: ['', Validators.minLength(6)],
    rol: ['OPERADOR', Validators.required],
  });

  get esEdicion(): boolean {
    return this.id !== null;
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) return;

    this.id = +idParam;
    this.loading.set(true);
    this.form.get('clave')?.clearValidators();
    this.form.get('clave')?.updateValueAndValidity();

    this.usuariosService.obtenerPorId(this.id).subscribe({
      next: usuario => {
        this.form.patchValue({
          nombre: usuario.nombre,
          apellido: usuario.apellido ?? '',
          email: usuario.email ?? '',
          cuil: usuario.cuil ?? '',
          rol: usuario.rol,
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

    const { nombre, apellido, email, cuil, clave, rol } = this.form.value;

    if (this.esEdicion) {
      const data: UpdateUsuarioPayload = { nombre: nombre!, rol: rol! };
      if (clave) data.clave = clave;
      if (apellido) data.apellido = apellido;
      if (email) data.email = email;
      if (cuil) data.cuil = cuil;

      this.usuariosService.actualizar(this.id!, data).subscribe({
        next: () => this.router.navigate(['/app/usuarios']),
        error: () => {
          this.errorMessage.set('Error al actualizar el usuario');
          this.guardando.set(false);
        },
      });
    } else {
      const data: CreateUsuarioPayload = { nombre: nombre!, clave: clave!, rol: rol! };
      if (apellido) data.apellido = apellido;
      if (email) data.email = email;
      if (cuil) data.cuil = cuil;

      this.usuariosService.crear(data).subscribe({
        next: () => this.router.navigate(['/app/usuarios']),
        error: () => {
          this.errorMessage.set('Error al crear el usuario. Verificá que el email o CUIL no estén en uso.');
          this.guardando.set(false);
        },
      });
    }
  }
}
