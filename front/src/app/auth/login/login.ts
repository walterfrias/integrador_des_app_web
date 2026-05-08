import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, PasswordModule, MessageModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);

  form = this.fb.group({
    nombre: ['', Validators.required],
    clave: ['', Validators.required],
  });

  loading = false;
  errorMessage = '';

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const { nombre, clave } = this.form.value;

    this.auth.login(nombre!, clave!).subscribe({
      next: () => this.router.navigate(['/app/dashboard']),
      error: () => {
        this.errorMessage = 'Credenciales incorrectas';
        this.loading = false;
      },
    });
  }
}
