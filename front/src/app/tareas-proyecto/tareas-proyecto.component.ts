import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { TareasService } from '../core/services/tareas.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-tareas-proyecto',
  standalone: true,
  imports: [DatePipe, NgClass, TagModule, RouterLink],
  templateUrl: './tareas-proyecto.component.html',
})
export class TareasProyectoComponent implements OnInit {
  private tareasService = inject(TareasService);
  private auth = inject(AuthService);
  private router = inject(Router);

  private readonly usuarioActual = this.auth.getUsuario();

  tareas = signal<any[]>([]);
  loading = signal(true);
  filtroEstado = signal('TODOS');
  filtroProyecto = signal('TODOS');
  busqueda = signal('');

  readonly estados = ['TODOS', 'PENDIENTE', 'FINALIZADA', 'BAJA'];
  readonly hoy = new Date();

  misTareas = computed(() =>
    this.tareas().filter(t => t.responsable?.id === this.usuarioActual?.id)
  );

  proyectosDisponibles = computed(() => {
    const nombres = new Set<string>();
    this.misTareas().forEach(t => { if (t.proyecto?.nombre) nombres.add(t.proyecto.nombre); });
    return Array.from(nombres).sort();
  });

  tareasFiltradas = computed(() => {
    const q = this.busqueda().toLowerCase().trim();
    const estado = this.filtroEstado();
    const proyecto = this.filtroProyecto();
    return this.misTareas().filter(t => {
      const matchEstado = estado === 'TODOS' || t.estado === estado;
      const matchProyecto = proyecto === 'TODOS' || t.proyecto?.nombre === proyecto;
      const matchQ = !q || t.descripcion?.toLowerCase().includes(q) || t.proyecto?.nombre?.toLowerCase().includes(q);
      return matchEstado && matchProyecto && matchQ;
    });
  });

  hayFiltros = computed(() =>
    this.busqueda() !== '' || this.filtroEstado() !== 'TODOS' || this.filtroProyecto() !== 'TODOS'
  );

  ngOnInit() { this.cargar(); }

  cargar() {
    this.loading.set(true);
    this.tareasService.listarTodas().subscribe({
      next: (data) => { this.tareas.set(data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  limpiar() {
    this.busqueda.set('');
    this.filtroEstado.set('TODOS');
    this.filtroProyecto.set('TODOS');
  }

  irAProyecto(id: number) {
    this.router.navigate(['/app/proyectos', id]);
  }

  severidadEstado(estado: string): 'warn' | 'success' | 'danger' {
    switch (estado) {
      case 'PENDIENTE': return 'warn';
      case 'FINALIZADA': return 'success';
      default: return 'danger';
    }
  }
}
