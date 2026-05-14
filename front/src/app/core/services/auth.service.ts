import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

interface LoginResponse {
  accessToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly TOKEN_KEY = 'access_token';

  login(email: string, clave: string) {
    return this.http.post<LoginResponse>('/api/v1/auth', { email, clave }).pipe(
      tap(res => localStorage.setItem(this.TOKEN_KEY, res.accessToken))
    );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUsuario(): { nombre: string; rol: string } | null {
    const token = this.getToken();
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { nombre: payload.nombre, rol: payload.rol };
  }
}
