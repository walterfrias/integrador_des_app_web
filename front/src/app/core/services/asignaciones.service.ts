import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface Asignacion {
  id: number;
  usuarioId: number;
  usuarioNombre: string;
  proyectoId: number;
  proyectoNombre: string;
  estado: 'ACTIVO' | 'BAJA';
  fechaAsignacion: string;
}

@Injectable({ providedIn: 'root' })
export class AsignacionesService {
  private http = inject(HttpClient);
  private readonly base = '/api/v1/asignaciones';

  listarPorProyecto(proyectoId: number) {
    const params = new HttpParams().set('proyectoId', proyectoId);
    return this.http.get<Asignacion[]>(this.base, { params });
  }

  asignar(usuarioId: number, proyectoId: number) {
    return this.http.post<{ id: number }>(this.base, { usuarioId, proyectoId });
  }

  darDeBaja(id: number) {
    return this.http.put<void>(`${this.base}/${id}`, { estado: 'BAJA' });
  }

  reactivar(id: number) {
    return this.http.put<void>(`${this.base}/${id}`, { estado: 'ACTIVO' });
  }
}
