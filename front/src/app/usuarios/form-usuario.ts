import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { UsuariosService, CreateUsuarioPayload, UpdateUsuarioPayload } from '../core/services/usuarios.service';

@Component({
  selector: 'app-form-usuario',
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, InputMaskModule, SelectModule, RouterLink, ToastModule],
  providers: [MessageService],
  templateUrl: './form-usuario.html',
})
export class FormUsuarioComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private usuariosService = inject(UsuariosService);

  private messageService = inject(MessageService);

  id: number | null = null;
  loading = signal(false);
  guardando = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);
  showConfirm = signal(false);

  private clavesCoincidenValidator = (control: AbstractControl): ValidationErrors | null => {
    const clave = control.get('clave')?.value;
    const confirmar = control.get('confirmarClave')?.value;
    if (!clave && !confirmar) return null;
    return clave === confirmar ? null : { clavesMismatch: true };
  };

  roles = [
    { label: 'Operador', value: 'OPERADOR' },
    { label: 'Administrador', value: 'ADMIN' },
  ];

  form = this.fb.group({
    nombre: ['', Validators.required],
    apellido: [''],
    email: ['', Validators.email],
    cuil: ['', Validators.pattern(/^\d{2}-\d{6}-\d{2}$/)],
    clave: ['', [Validators.minLength(5), Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)]],
    confirmarClave: [''],
    rol: ['OPERADOR', Validators.required],
  }, { validators: this.clavesCoincidenValidator });

  get esEdicion(): boolean {
    return this.id !== null;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
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
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Usuario actualizado', detail: `Los datos de ${nombre} fueron guardados.`, life: 2000 });
          setTimeout(() => this.router.navigate(['/app/usuarios']), 1500);
        },
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
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Usuario creado', detail: `${nombre} fue agregado al sistema.`, life: 2000 });
          setTimeout(() => this.router.navigate(['/app/usuarios']), 1500);
        },
        error: () => {
          this.errorMessage.set('Error al crear el usuario. Verificá que el email o CUIL no estén en uso.');
          this.guardando.set(false);
        },
      });
    }
  }
}
