import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { AuthService } from '../core/services/auth.service';
import { StatsService, Stats, ActividadSemanal, CreadasVsFinalizadas, TareaEstadoUsuario } from '../core/services/stats.service';

interface ModuloCard {
  label: string;
  descripcion: string;
  icon: string;
  route: string;
  color: string;
  adminOnly?: boolean;
}

const PALETA = ['#3b82f6', '#a855f7', '#f97316', '#ec4899', '#14b8a6'];

function formatearSemana(iso: string): string {
  const d = new Date(iso + 'T12:00:00Z');
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', timeZone: 'UTC' });
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, ChartModule],
  templateUrl: './dashboard.html',
})
export class DashboardComponent {
  private auth = inject(AuthService);
  private statsService = inject(StatsService);
  private router = inject(Router);

  usuario = this.auth.getUsuario();
  private usuariosStats: TareaEstadoUsuario[] = [];

  stats = signal<Stats | null>(null);
  chartProyectos = signal<any>(null);
  chartTareas = signal<any>(null);
  chartBarraApilada = signal<any>(null);
  chartArea = signal<any>(null);
  chartDelta = signal<any>(null);

  chartOpciones = {
    plugins: { legend: { position: 'bottom' } },
    responsive: true,
    maintainAspectRatio: false,
  };

  chartOpcionesApilada = {
    plugins: { legend: { position: 'bottom' } },
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
    onClick: (_: any, elements: any[]) => {
      if (elements.length > 0) {
        const usuario = this.usuariosStats[elements[0].index];
        if (usuario) this.router.navigate(['/app/usuarios', usuario.usuarioId, 'detalle']);
      }
    },
    onHover: (event: any, elements: any[]) => {
      event.native.target.style.cursor = elements.length ? 'pointer' : 'default';
    },
  };

  chartOpcionesArea = {
    plugins: { legend: { position: 'bottom' } },
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { precision: 0 } },
    },
    elements: { line: { tension: 0.4 } },
  };

  chartOpcionesDelta = {
    plugins: { legend: { position: 'bottom' } },
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { precision: 0 } },
    },
  };

  modulos: ModuloCard[] = [
    {
      label: 'Proyectos',
      descripcion: 'Gestioná los proyectos del equipo',
      icon: 'pi pi-briefcase',
      route: '/app/proyectos',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Clientes',
      descripcion: 'Administrá la cartera de clientes',
      icon: 'pi pi-users',
      route: '/app/clientes',
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Usuarios',
      descripcion: 'Gestioná los usuarios del sistema',
      icon: 'pi pi-user',
      route: '/app/usuarios',
      color: 'bg-indigo-50 text-indigo-600',
      adminOnly: true,
    },
  ];

  get modulosVisibles(): ModuloCard[] {
    return this.modulos.filter(m => !m.adminOnly || this.usuario?.rol === 'ADMIN');
  }

  get gridModulos(): string {
    const n = this.modulosVisibles.length;
    if (n === 1) return 'grid grid-cols-1 max-w-sm gap-4';
    if (n === 2) return 'grid grid-cols-1 sm:grid-cols-2 gap-4';
    return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4';
  }

  constructor() {
    this.statsService.getStats().subscribe(s => {
      this.stats.set(s);
      this.buildDonuts(s);
      this.buildBarraApilada(s);
    });

    this.statsService.getActividadSemanal().subscribe(a => this.buildAreaChart(a));

    this.statsService.getCreadasVsFinalizadas().subscribe(d => this.buildDeltaChart(d));
  }

  private buildDonuts(s: Stats) {
    this.chartProyectos.set({
      labels: ['Activos', 'Finalizados', 'Baja'],
      datasets: [{
        data: [s.proyectosActivos, s.proyectosFinalizados, s.proyectosBaja],
        backgroundColor: ['#3b82f6', '#22c55e', '#94a3b8'],
        hoverOffset: 6,
      }],
    });

    this.chartTareas.set({
      labels: ['Pendientes', 'Finalizadas', 'Baja'],
      datasets: [{
        data: [s.tareasPendientes, s.tareasFinalizadas, s.tareasBaja],
        backgroundColor: ['#f59e0b', '#22c55e', '#94a3b8'],
        hoverOffset: 6,
      }],
    });
  }

  private buildBarraApilada(s: Stats) {
    this.usuariosStats = s.tareasPorUsuarioEstado;
    const usuarios = s.tareasPorUsuarioEstado;
    this.chartBarraApilada.set({
      labels: usuarios.map(u => u.apellido ? `${u.nombre} ${u.apellido}` : u.nombre),
      datasets: [
        { label: 'Pendientes', data: usuarios.map(u => u.pendientes), backgroundColor: '#f59e0b' },
        { label: 'Finalizadas', data: usuarios.map(u => u.finalizadas), backgroundColor: '#22c55e' },
      ],
    });
  }

  private buildAreaChart(actividad: ActividadSemanal) {
    const labels = actividad.semanas.map(formatearSemana);
    const datasets = actividad.series.map((serie, i) => {
      let suma = 0;
      return {
        label: serie.nombre,
        data: serie.datos.map(v => (suma += v)),
        fill: true,
        borderColor: PALETA[i % PALETA.length],
        backgroundColor: PALETA[i % PALETA.length] + '22',
        pointRadius: 4,
        pointHoverRadius: 6,
      };
    });
    this.chartArea.set({ labels, datasets });
  }

  private buildDeltaChart(data: CreadasVsFinalizadas) {
    this.chartDelta.set({
      labels: data.semanas.map(formatearSemana),
      datasets: [
        {
          label: 'Creadas',
          data: data.creadas,
          backgroundColor: '#64748bcc',
          borderColor: '#64748b',
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: 'Finalizadas',
          data: data.finalizadas,
          backgroundColor: '#22c55ecc',
          borderColor: '#22c55e',
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    });
  }
}
