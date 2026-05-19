import { Component, inject, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { RouterLink } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { AuthService } from '../core/services/auth.service';
import { StatsService, Stats, ActividadSemanal } from '../core/services/stats.service';

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
export class DashboardComponent implements OnInit {
  private auth = inject(AuthService);
  private statsService = inject(StatsService);

  usuario = this.auth.getUsuario();
  stats: Stats | null = null;

  chartProyectos: any;
  chartTareas: any;
  chartBarraApilada: any;
  chartArea: any;
  chartOpciones: any;
  chartOpcionesApilada: any;
  chartOpcionesArea: any;

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

  ngOnInit() {
    this.chartOpciones = {
      plugins: { legend: { position: 'bottom' } },
      responsive: true,
      maintainAspectRatio: false,
    };

    this.chartOpcionesApilada = {
      plugins: { legend: { position: 'bottom' } },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, ticks: { precision: 0 } },
      },
    };

    this.chartOpcionesArea = {
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

    forkJoin({
      stats: this.statsService.getStats(),
      actividad: this.statsService.getActividadSemanal(),
    }).subscribe(({ stats, actividad }) => {
      this.stats = stats;
      this.buildDonuts(stats);
      this.buildBarraApilada(stats);
      this.buildAreaChart(actividad);
    });
  }

  private buildDonuts(s: Stats) {
    this.chartProyectos = {
      labels: ['Activos', 'Finalizados', 'Baja'],
      datasets: [{
        data: [s.proyectosActivos, s.proyectosFinalizados, s.proyectosBaja],
        backgroundColor: ['#3b82f6', '#22c55e', '#94a3b8'],
        hoverOffset: 6,
      }],
    };

    this.chartTareas = {
      labels: ['Pendientes', 'Finalizadas', 'Baja'],
      datasets: [{
        data: [s.tareasPendientes, s.tareasFinalizadas, s.tareasBaja],
        backgroundColor: ['#f59e0b', '#22c55e', '#94a3b8'],
        hoverOffset: 6,
      }],
    };
  }

  private buildBarraApilada(s: Stats) {
    const usuarios = s.tareasPorUsuarioEstado;
    this.chartBarraApilada = {
      labels: usuarios.map(u => u.apellido ? `${u.nombre} ${u.apellido}` : u.nombre),
      datasets: [
        {
          label: 'Pendientes',
          data: usuarios.map(u => u.pendientes),
          backgroundColor: '#f59e0b',
        },
        {
          label: 'Finalizadas',
          data: usuarios.map(u => u.finalizadas),
          backgroundColor: '#22c55e',
        },
      ],
    };
  }

  private buildAreaChart(actividad: ActividadSemanal) {
    const labels = actividad.semanas.map(formatearSemana);
    const datasets = actividad.series.map((serie, i) => {
      let suma = 0;
      const acumulado = serie.datos.map(v => (suma += v));
      return {
        label: serie.nombre,
        data: acumulado,
        fill: true,
        borderColor: PALETA[i % PALETA.length],
        backgroundColor: PALETA[i % PALETA.length] + '22',
        pointRadius: 4,
        pointHoverRadius: 6,
      };
    });
    this.chartArea = { labels, datasets };
  }
}
