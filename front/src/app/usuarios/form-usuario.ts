import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { UsuariosService } from '../core/services/usuarios.service';

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
        this.form.patchValue({ nombre: usuario.nombre, rol: usuario.rol });
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.guardando.set(true);
    this.errorMessage.set('');

    const { nombre, clave, rol } = this.form.value;

    if (this.esEdicion) {
      const data: Record<string, string> = { nombre: nombre!, rol: rol! };
      if (clave) data['clave'] = clave;

      this.usuariosService.actualizar(this.id!, data).subscribe({
        next: () => this.router.navigate(['/app/usuarios']),
        error: () => {
          this.errorMessage.set('Error al actualizar el usuario');
          this.guardando.set(false);
        },
      });
    } else {
      this.usuariosService.crear({ nombre: nombre!, clave: clave!, rol: rol! }).subscribe({
        next: () => this.router.navigate(['/app/usuarios']),
        error: () => {
          this.errorMessage.set('Error al crear el usuario. El nombre puede estar en uso.');
          this.guardando.set(false);
        },
      });
    }
  }
}
