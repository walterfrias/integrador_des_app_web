import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TareasService {
  private base = 'http://localhost:3000/api/v1/proyectos';

  constructor(private http: HttpClient) {}

  crearTarea(idProyecto: number, tarea: { descripcion: string }) {
    return this.http.post(`http://localhost:3000/api/v1/proyectos/${idProyecto}/tareas`, tarea);
  }

  actualizarTarea(idProyecto: number, idTarea: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.base}/${idProyecto}/tareas/${idTarea}`, data);
  }

  eliminarTarea(idProyecto: number, idTarea: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/${idProyecto}/tareas/${idTarea}`);
  }

  listarTodas(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/api/v1/proyectos/0/tareas`);
  }

  listarPorProyecto(idProyecto: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/api/v1/proyectos/${idProyecto}/tareas`);
  }
}
