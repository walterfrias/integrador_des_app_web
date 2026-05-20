import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StatsService, DetalleUsuario } from '../core/services/stats.service';

const ESTADO_CLASE: Record<string, string> = {
  PENDIENTE: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  FINALIZADA: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  BAJA: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
};

const ESTADO_PROYECTO_CLASE: Record<string, string> = {
  ACTIVO: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  FINALIZADO: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  BAJA: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
};

@Component({
  selector: 'app-detalle-usuario',
  imports: [RouterLink, DatePipe],
  templateUrl: './detalle-usuario.html',
})
export class DetalleUsuarioComponent {
  private route = inject(ActivatedRoute);
  private statsService = inject(StatsService);

  detalle = signal<DetalleUsuario | null>(null);
  cargando = signal(true);
  error = signal(false);

  estadoClase = ESTADO_CLASE;
  estadoProyectoClase = ESTADO_PROYECTO_CLASE;

  totalTareas = computed(() =>
    this.detalle()?.proyectos.reduce((acc, p) => acc + p.tareas.length, 0) ?? 0
  );

  tareasFinalizadas = computed(() =>
    this.detalle()?.proyectos.reduce(
      (acc, p) => acc + p.tareas.filter(t => t.estado === 'FINALIZADA').length,
      0
    ) ?? 0
  );

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.statsService.getDetalleUsuario(id).subscribe({
      next: d => { this.detalle.set(d); this.cargando.set(false); },
      error: () => { this.error.set(true); this.cargando.set(false); },
    });
  }
}
