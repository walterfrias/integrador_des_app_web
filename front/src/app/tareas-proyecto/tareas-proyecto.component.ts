import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { TareasService } from '../core/services/tareas.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-tareas-proyecto',
  standalone: true,
  imports: [DatePipe, NgClass, TagModule],
  templateUrl: './tareas-proyecto.component.html',
})
export class TareasProyectoComponent implements OnInit {
  private tareasService = inject(TareasService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private readonly usuarioActual = this.auth.getUsuario();
  readonly soloMias: boolean = this.route.snapshot.data['soloMias'] ?? false;

  tareas = signal<any[]>([]);
  loading = signal(true);
  filtroEstado = signal('TODOS');
  filtroProyecto = signal('TODOS');
  filtroUsuario = signal<number | null>(null);
  busqueda = signal('');

  readonly estados = ['TODOS', 'PENDIENTE', 'FINALIZADA', 'BAJA'];
  readonly hoy = new Date();

  tareasBase = computed(() =>
    this.soloMias
      ? this.tareas().filter(t => t.responsable?.id === this.usuarioActual?.id)
      : this.tareas()
  );

  proyectosDisponibles = computed(() => {
    const nombres = new Set<string>();
    this.tareasBase().forEach(t => { if (t.proyecto?.nombre) nombres.add(t.proyecto.nombre); });
    return Array.from(nombres).sort();
  });

  usuariosDisponibles = computed(() => {
    const mapa = new Map<number, string>();
    this.tareasBase().forEach(t => {
      if (t.responsable?.id) {
        mapa.set(t.responsable.id, t.responsable.nombre);
      }
    });
    return Array.from(mapa.entries())
      .map(([id, nombre]) => ({ id, nombre }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
  });

  tareasFiltradas = computed(() => {
    const q = this.busqueda().toLowerCase().trim();
    const estado = this.filtroEstado();
    const proyecto = this.filtroProyecto();
    const usuario = this.filtroUsuario();
    return this.tareasBase().filter(t => {
      const matchEstado = estado === 'TODOS' || t.estado === estado;
      const matchProyecto = proyecto === 'TODOS' || t.proyecto?.nombre === proyecto;
      const matchUsuario = usuario === null || t.responsable?.id === usuario;
      const matchQ = !q || t.descripcion?.toLowerCase().includes(q) || t.proyecto?.nombre?.toLowerCase().includes(q);
      return matchEstado && matchProyecto && matchUsuario && matchQ;
    });
  });

  hayFiltros = computed(() =>
    this.busqueda() !== '' ||
    this.filtroEstado() !== 'TODOS' ||
    this.filtroProyecto() !== 'TODOS' ||
    this.filtroUsuario() !== null
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
    this.filtroUsuario.set(null);
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
