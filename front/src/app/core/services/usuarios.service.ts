import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string | null;
  email: string | null;
  cuil: string | null;
  rol: 'ADMIN' | 'OPERADOR';
  estado: 'ACTIVO' | 'BAJA';
}

export interface CreateUsuarioPayload {
  nombre: string;
  clave: string;
  rol: string;
  apellido?: string;
  email?: string;
  cuil?: string;
}

export interface UpdateUsuarioPayload {
  nombre?: string;
  clave?: string;
  rol?: string;
  apellido?: string;
  email?: string;
  cuil?: string;
  estado?: string;
}

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private http = inject(HttpClient);
  private readonly base = '/api/v1/usuarios';

  listar() {
    return this.http.get<Usuario[]>(this.base);
  }

  obtenerPorId(id: number) {
    return this.http.get<Usuario>(`${this.base}/${id}`);
  }

  crear(data: CreateUsuarioPayload) {
    return this.http.post<{ id: number }>(this.base, data);
  }

  actualizar(id: number, data: UpdateUsuarioPayload) {
    return this.http.put<void>(`${this.base}/${id}`, data);
  }

  darDeBaja(id: number) {
    return this.http.put<void>(`${this.base}/${id}`, { estado: 'BAJA' });
  }
}
