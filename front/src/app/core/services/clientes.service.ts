import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Contacto {
  id: number;
  tipo: 'TELEFONO' | 'EMAIL';
  valor: string;
  observacion: string | null;
}

export interface CreateContactoPayload {
  tipo: 'TELEFONO' | 'EMAIL';
  valor: string;
  observacion?: string;
}

export interface UpdateContactoPayload {
  tipo?: 'TELEFONO' | 'EMAIL';
  valor?: string;
  observacion?: string;
}

export interface Cliente {
  id: number;
  nombre: string;
  cuit: string | null;
  direccion: string | null;
  estado: 'ACTIVO' | 'INACTIVO';
  contactos?: Contacto[]; // <-- Única modificación a lo existente: le avisamos que puede tener contactos
}

export interface CreateClientePayload {
  nombre: string;
  cuit?: string;
  direccion?: string;
}

export interface UpdateClientePayload {
  nombre?: string;
  cuit?: string;
  direccion?: string;
  estado?: string;
}

@Injectable({ providedIn: 'root' })
export class ClientesService {
  private http = inject(HttpClient);
  private readonly base = '/api/v1/clientes';

  listar() {
    return this.http.get<Cliente[]>(this.base);
  }

  obtenerPorId(id: number) {
    return this.http.get<Cliente>(`${this.base}/${id}`);
  }

  crear(data: CreateClientePayload) {
    return this.http.post<{ id: number }>(this.base, data);
  }

  actualizar(id: number, data: UpdateClientePayload) {
    return this.http.put<void>(`${this.base}/${id}`, data);
  }

  // --- PASO 2: NUEVOS MÉTODOS HTTP PARA CONTACTOS ---
  agregarContacto(clienteId: number, data: CreateContactoPayload) {
    return this.http.post<{ id: number }>(`${this.base}/${clienteId}/contactos`, data);
  }

  modificarContacto(contactoId: number, data: UpdateContactoPayload) {
    return this.http.put<void>(`${this.base}/contactos/${contactoId}`, data);
  }

  eliminarContacto(contactoId: number) {
    return this.http.delete<void>(`${this.base}/contactos/${contactoId}`);
  }
  // --------------------------------------------------
}