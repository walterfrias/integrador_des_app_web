import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Contacto {
  id: number;
  tipo: 'TELEFONO' | 'EMAIL';
  valor: string;
  observacion?: string | null;
}

export interface ClienteDetalle {
  id: number;
  nombre: string;
  cuit: string | null;
  direccion: string | null;
  estado: 'ACTIVO' | 'BAJA';
  contactos: Contacto[];
}

export interface Cliente {
  id: number;
  nombre: string;
  cuit: string | null;
  direccion: string | null;
  estado: 'ACTIVO' | 'BAJA';
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

export interface ContactoPayload {
  tipo: string;
  valor: string;
  observacion?: string;
}

@Injectable({ providedIn: 'root' })
export class ClientesService {
  private http = inject(HttpClient);
  private readonly base = '/api/v1/clientes';

  listar() {
    return this.http.get<Cliente[]>(this.base);
  }

  obtenerPorId(id: number) {
    return this.http.get<ClienteDetalle>(`${this.base}/${id}`);
  }

  crear(data: CreateClientePayload) {
    return this.http.post<{ id: number }>(this.base, data);
  }

  actualizar(id: number, data: UpdateClientePayload) {
    return this.http.put<void>(`${this.base}/${id}`, data);
  }

  agregarContacto(idCliente: number, data: ContactoPayload) {
    return this.http.post<{ id: number }>(`${this.base}/${idCliente}/contactos`, data);
  }

  modificarContacto(idContacto: number, data: ContactoPayload) {
    return this.http.put<void>(`${this.base}/contactos/${idContacto}`, data);
  }

  eliminarContacto(idContacto: number) {
    return this.http.delete<void>(`${this.base}/contactos/${idContacto}`);
  }
}
