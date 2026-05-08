import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Usuario {
  id: number;
  nombre: string;
  rol: 'ADMIN' | 'USER';
  estado: 'ACTIVO' | 'BAJA';
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

  crear(data: { nombre: string; clave: string; rol: string }) {
    return this.http.post<{ id: number }>(this.base, data);
  }

  actualizar(id: number, data: { nombre?: string; clave?: string; rol?: string }) {
    return this.http.put<void>(`${this.base}/${id}`, data);
  }

  darDeBaja(id: number) {
    return this.http.put<void>(`${this.base}/${id}`, { estado: 'BAJA' });
  }
}
