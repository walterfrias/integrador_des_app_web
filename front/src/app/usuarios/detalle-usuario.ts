import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
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
  imports: [RouterLink, DatePipe, TableModule, ChartModule],
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
      (acc, p) => acc + p.tareas.filter(t => t.estado === 'FINALIZADA').length, 0
    ) ?? 0
  );

  tasaCompletado = computed(() => {
    const total = this.totalTareas();
    return total === 0 ? 0 : Math.round((this.tareasFinalizadas() / total) * 100);
  });

  desempeno = computed(() => {
    const pct = this.tasaCompletado();
    if (pct >= 80) return { label: 'Buen desempeño', clase: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', color: 'text-emerald-500' };
    if (pct >= 50) return { label: 'Desempeño regular', clase: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', color: 'text-amber-500' };
    return { label: 'Necesita atención', clase: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', color: 'text-red-500' };
  });

  progresoPorProyecto = computed(() =>
    (this.detalle()?.proyectos ?? []).map(p => {
      const total = p.tareas.length;
      const fin = p.tareas.filter(t => t.estado === 'FINALIZADA').length;
      const pct = total === 0 ? 0 : Math.round((fin / total) * 100);
      return { nombre: p.nombre, estado: p.estado, total, fin, pct };
    })
  );

  datosMedidor = computed(() => {
    const pct = this.tasaCompletado();
    return {
      labels: ['Completado', 'Pendiente'],
      datasets: [{
        data: [pct, 100 - pct],
        backgroundColor: ['rgba(16,185,129,0.85)', 'rgba(148,163,184,0.12)'],
        borderWidth: 0,
        hoverOffset: 4,
      }],
    };
  });

  readonly opcionesMedidor = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '78%',
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  colorBarra(pct: number): string {
    if (pct === 100) return 'bg-emerald-500';
    if (pct >= 80)   return 'bg-emerald-400';
    if (pct >= 50)   return 'bg-amber-400';
    return 'bg-red-400';
  }

  colorTextoPct(pct: number): string {
    if (pct === 100) return 'text-emerald-500';
    if (pct >= 80)   return 'text-emerald-500';
    if (pct >= 50)   return 'text-amber-500';
    return 'text-red-400';
  }

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.statsService.getDetalleUsuario(id).subscribe({
      next: d => { this.detalle.set(d); this.cargando.set(false); },
      error: () => { this.error.set(true); this.cargando.set(false); },
    });
  }
}
