import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface TareasPorResponsable {
  usuarioId: number;
  nombre: string;
  apellido: string | null;
  total: number;
}

export interface TareaEstadoUsuario {
  nombre: string;
  apellido: string | null;
  pendientes: number;
  finalizadas: number;
}

export interface SerieSemanal {
  nombre: string;
  datos: number[];
}

export interface ActividadSemanal {
  semanas: string[];
  series: SerieSemanal[];
}

export interface Stats {
  proyectosActivos: number;
  proyectosFinalizados: number;
  proyectosBaja: number;
  proyectosRetrasados: number;
  tareasPendientes: number;
  tareasFinalizadas: number;
  tareasBaja: number;
  clientesActivos: number;
  usuariosActivos: number;
  tareasPorResponsable: TareasPorResponsable[];
  tareasPorUsuarioEstado: TareaEstadoUsuario[];
}

@Injectable({ providedIn: 'root' })
export class StatsService {
  private http = inject(HttpClient);

  getStats() {
    return this.http.get<Stats>('/api/v1/stats');
  }

  getActividadSemanal() {
    return this.http.get<ActividadSemanal>('/api/v1/stats/actividad-semanal');
  }
}
