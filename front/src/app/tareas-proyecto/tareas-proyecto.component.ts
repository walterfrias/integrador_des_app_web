import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TareasService } from '../core/services/tareas.service';

@Component({
  selector: 'app-tareas-proyecto',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule],
  providers: [MessageService],
  templateUrl: './tareas-proyecto.component.html',
})
export class TareasProyectoComponent implements OnInit {
  private tareasService = inject(TareasService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  todasLasTareas = signal<any[]>([]);
  busqueda = signal('');
  filtroEstado = signal('TODOS');
  filtroProyecto = signal('TODOS');
  filtroUsuario = signal('TODOS');
  nuevaTareaTexto: { [key: string]: string } = {};

  readonly estados = ['TODOS', 'PENDIENTE', 'FINALIZADA', 'BAJA'];

  private readonly PALETA = [
    'bg-indigo-500', 'bg-violet-500', 'bg-sky-500',
    'bg-emerald-500', 'bg-amber-500', 'bg-rose-500',
    'bg-pink-500', 'bg-teal-500',
  ];

  private idProyectoPorNombre = computed(() => {
    const mapa = new Map<string, number>();
    this.todasLasTareas().forEach(t => {
      if (t.proyecto?.nombre && t.proyecto?.id) {
        mapa.set(t.proyecto.nombre, t.proyecto.id);
      }
    });
    return mapa;
  });

  proyectosDisponibles = computed(() => {
    const nombres = new Set<string>();
    this.todasLasTareas().forEach(t => {
      if (t.proyecto?.nombre) nombres.add(t.proyecto.nombre);
    });
    return Array.from(nombres).sort();
  });

  usuariosDisponibles = computed(() => {
    const lista: { id: string; nombreCompleto: string; iniciales: string; color: string }[] = [];
    const seen = new Set<string>();
    let idx = 0;
    this.todasLasTareas().forEach(t => {
      if (t.responsable) {
        const key = String(t.responsable.id);
        if (!seen.has(key)) {
          seen.add(key);
          const nombre = t.responsable.nombre ?? '';
          const apellido = t.responsable.apellido ?? '';
          lista.push({
            id: key,
            nombreCompleto: [nombre, apellido].filter(Boolean).join(' '),
            iniciales: ((nombre[0] ?? '') + (apellido[0] ?? '')).toUpperCase() || '?',
            color: this.PALETA[idx++ % this.PALETA.length],
          });
        }
      }
    });
    return lista;
  });

  private mapaColores = computed(() => {
    const m = new Map<string, string>();
    this.usuariosDisponibles().forEach(u => m.set(u.id, u.color));
    return m;
  });

  tieneTareasSinAsignar = computed(() =>
    this.todasLasTareas().some(t => !t.responsable)
  );

  tareasFiltradas = computed(() => {
    const q = this.busqueda().toLowerCase().trim();
    const estado = this.filtroEstado();
    const proyecto = this.filtroProyecto();
    const usuario = this.filtroUsuario();
    return this.todasLasTareas().filter(t => {
      const matchEstado = estado === 'TODOS' || t.estado === estado;
      const matchProyecto = proyecto === 'TODOS' || t.proyecto?.nombre === proyecto;
      const matchUsuario = usuario === 'TODOS'
        || (usuario === 'SIN_ASIGNAR' && !t.responsable)
        || (t.responsable && String(t.responsable.id) === usuario);
      const matchQ = !q
        || t.descripcion?.toLowerCase().includes(q)
        || t.proyecto?.nombre?.toLowerCase().includes(q);
      return matchEstado && matchProyecto && matchUsuario && matchQ;
    });
  });

  columnasFiltradas = computed(() => {
    const cols: { [key: string]: any[] } = {};
    this.tareasFiltradas().forEach(t => {
      const nombreP = t.proyecto?.nombre || 'General';
      if (!cols[nombreP]) cols[nombreP] = [];
      cols[nombreP].push(t);
    });
    return cols;
  });

  hayFiltrosActivos = computed(() =>
    this.busqueda() !== ''
    || this.filtroEstado() !== 'TODOS'
    || this.filtroProyecto() !== 'TODOS'
    || this.filtroUsuario() !== 'TODOS'
  );

  ngOnInit(): void {
    this.cargar();
  }

  cargar() {
    this.tareasService.listarTodas().subscribe({
      next: (data: any[]) => this.todasLasTareas.set(data),
      error: (err) => console.error('Error al cargar:', err),
    });
  }

  getNombres(): string[] {
    return Object.keys(this.columnasFiltradas());
  }

  limpiarFiltros() {
    this.busqueda.set('');
    this.filtroEstado.set('TODOS');
    this.filtroProyecto.set('TODOS');
    this.filtroUsuario.set('TODOS');
  }

  filtrarPorUsuario(event: MouseEvent, idUsuario: string) {
    event.stopPropagation();
    this.filtroUsuario.set(idUsuario);
  }

  colorDeUsuario(id: string): string {
    return this.mapaColores().get(id) ?? 'bg-slate-400';
  }

  inicialesDeResponsable(responsable: any): string {
    const n = responsable?.nombre?.[0] ?? '';
    const a = responsable?.apellido?.[0] ?? '';
    return (n + a).toUpperCase() || '?';
  }

  idStr(id: any): string {
    return String(id);
  }

  readonly LIMITE_VISIBLE = 3;

  tareasVisibles(nombreP: string): any[] {
    return this.columnasFiltradas()[nombreP]?.slice(0, this.LIMITE_VISIBLE) ?? [];
  }

  tareasOcultas(nombreP: string): number {
    const total = this.columnasFiltradas()[nombreP]?.length ?? 0;
    return Math.max(0, total - this.LIMITE_VISIBLE);
  }

  irAProyecto(idProyecto: number | undefined) {
    if (!idProyecto) return;
    this.router.navigate(['/app/proyectos', idProyecto]);
  }

  verMas(nombreP: string) {
    const id = this.idProyectoPorNombre().get(nombreP);
    this.irAProyecto(id);
  }

  agregarTarea(nombreProyecto: string) {
    const descripcion = this.nuevaTareaTexto[nombreProyecto]?.trim();
    if (!descripcion) return;
    const idProyecto = this.idProyectoPorNombre().get(nombreProyecto);
    if (!idProyecto) return;
    this.tareasService.crearTarea(idProyecto, { descripcion }).subscribe({
      next: () => {
        this.nuevaTareaTexto[nombreProyecto] = '';
        this.cargar();
        this.messageService.add({ severity: 'success', summary: 'Tarea creada', detail: `Tarea agregada al proyecto "${nombreProyecto}".`, life: 3000 });
      },
      error: (err) => console.error('Error al crear la tarea:', err),
    });
  }
}
