import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TareasService } from '../core/services/tareas.service';

@Component({
  selector: 'app-tareas-proyecto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tareas-proyecto.component.html',
})
export class TareasProyectoComponent implements OnInit {
  columnas: { [key: string]: any[] } = {};

  nuevaTareaTexto: { [key: string]: string } = {};

  constructor(
    private tareasService: TareasService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar() {
    this.tareasService.listarTodas().subscribe({
      next: (data: any[]) => {
        this.columnas = {};
        data.forEach((t) => {
          const nombreP = t.proyecto?.nombre || 'General';
          if (!this.columnas[nombreP]) this.columnas[nombreP] = [];
          this.columnas[nombreP].push(t);
        });
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar:', err),
    });
  }

  getNombres(): string[] {
    return Object.keys(this.columnas);
  }

  agregarTarea(nombreProyecto: string) {
    const descripcion = this.nuevaTareaTexto[nombreProyecto]?.trim();
    if (!descripcion) return;

    const tareaExistente = this.columnas[nombreProyecto].find((t) => t.proyecto?.id);
    const idProyecto = tareaExistente?.proyecto?.id;

    if (!idProyecto) {
      console.error('ID de proyecto no encontrado');
      return;
    }

    this.tareasService.crearTarea(idProyecto, { descripcion }).subscribe({
      next: () => {
        this.nuevaTareaTexto[nombreProyecto] = '';
        this.cargar();
      },
      error: (err) => console.error('Error al crear la tarea:', err),
    });
  }

  eliminarTarea(idTarea: number) {
    this.tareasService.eliminarTarea(0, idTarea).subscribe(() => this.cargar());
  }

  actualizarEstado(tarea: any, event: any) {
    const nuevoEstado = event.target.value;
    const idProyecto = tarea.proyecto?.id || 0;
    const tareaActualizada = {
      descripcion: tarea.descripcion,
      estado: nuevoEstado,
    };

    this.tareasService.actualizarTarea(idProyecto, tarea.id, tareaActualizada).subscribe({
      next: () => {
        console.log('Estado actualizado correctamente');
        this.cargar();
      },
      error: (err) => console.error('Error al actualizar:', err),
    });
  }
  
  textoEdicion: string = '';
  tareaEditando: any = null;

  // Método para activar la edición
  editarTarea(tarea: any) {
    this.tareaEditando = tarea;
    this.textoEdicion = tarea.descripcion;
  }

  // Método para guardar
  guardarEdicion(tarea: any) {
    const idProyecto = tarea.proyecto?.id || 0;

    const data = {
      descripcion: this.textoEdicion,
      estado: tarea.estado,
    };

    this.tareasService.actualizarTarea(idProyecto, tarea.id, data).subscribe({
      next: () => {
        this.tareaEditando = null;
        this.cargar();
      },
      error: (err) => console.error('Error al editar:', err),
    });
  }
}
