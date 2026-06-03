import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../entities/cliente.entity';
import { EstadoProyecto, Proyecto } from '../entities/proyecto.entity';
import { CreateProyectoDto } from '../dtos/input/create-proyecto.dto';
import { UpdateProyectoDto } from '../dtos/input/update-proyecto.dto';
import { ListProyectoDTO } from '../dtos/output/list-proyecto.dto';
import { ProyectoDTO } from '../dtos/output/proyecto.dto';
import { EstadosClientesEnum } from '../enums/estados-clientes.enum';
import { EstadosProyectosEnum } from '../enums/estados-proyectos.enum';
import { EstadosTareasEnum } from '../enums/estados-tareas.enum';

@Injectable()
export class ProyectosService {
    constructor(
        @InjectRepository(Proyecto)
        private readonly proyectoRepository: Repository<Proyecto>,
        @InjectRepository(Cliente)
        private readonly clienteRepository: Repository<Cliente>,
    ) { }
    async listar(estado?: EstadosProyectosEnum): Promise<ListProyectoDTO[]> {
        const where = estado ? { estado: estado as unknown as EstadoProyecto } : {};
        const proyectos = await this.proyectoRepository.find({
            where,
            relations: { cliente: true },
        });
        const ordenProyecto = (p: Proyecto) => {
            if (this.calcularRetraso(p)) return 0;
            if (p.estado === EstadoProyecto.ACTIVO) return 1;
            if (p.estado === EstadoProyecto.FINALIZADO) return 2;
            return 3;
        };
        proyectos.sort((a, b) => ordenProyecto(a) - ordenProyecto(b));
        return proyectos.map((p) => ({
            id: p.id,
            nombre: p.nombre,
            estado: p.estado as unknown as EstadosProyectosEnum,
            fechaLimite: p.fechaLimite,
            retraso: this.calcularRetraso(p),
            cliente: p.cliente
                ? {
                    id: p.cliente.id,
                    nombre: p.cliente.nombre,
                    cuit: p.cliente.cuit,
                    direccion: p.cliente.direccion,
                    estado: p.cliente.estado,
                }
                : null,
        }));
    }
    async crear(dto: CreateProyectoDto): Promise<{ id: number }> {
        const existe = await this.proyectoRepository.findOneBy({ nombre: dto.nombre });
        if (existe) throw new ConflictException('El nombre del proyecto ya existe');
        if (dto.idCliente) {
            await this.validarClienteActivo(dto.idCliente);
        }
        if (dto.fechaLimite) {
            this.validarFechaFutura(dto.fechaLimite);
        }
        const proyecto = this.proyectoRepository.create({
            nombre: dto.nombre,
            estado: (dto.estado ?? EstadosProyectosEnum.ACTIVO) as unknown as EstadoProyecto,
            fechaLimite: dto.fechaLimite ?? null,
            cliente: dto.idCliente ? ({ id: dto.idCliente } as Cliente) : null,
        });
        const guardado = await this.proyectoRepository.save(proyecto);
        return { id: guardado.id };
    }
    async actualizar(id: number, dto: UpdateProyectoDto): Promise<void> {
        const proyecto = await this.proyectoRepository.findOneBy({ id });
        if (!proyecto) throw new NotFoundException('Proyecto no encontrado');
        if (dto.nombre) {
            const duplicado = await this.proyectoRepository.findOneBy({ nombre: dto.nombre });
            if (duplicado && duplicado.id !== id) {
                throw new ConflictException('El nombre del proyecto ya existe');
            }
        }
        if (dto.idCliente) {
            await this.validarClienteActivo(dto.idCliente);
        }
        if (dto.fechaLimite) {
            this.validarFechaFutura(dto.fechaLimite);
        }
        const updateData: Partial<Proyecto> = {};
        if (dto.nombre !== undefined) updateData.nombre = dto.nombre;
        if (dto.estado !== undefined) updateData.estado = dto.estado as unknown as EstadoProyecto;
        if (dto.fechaLimite !== undefined) updateData.fechaLimite = dto.fechaLimite;
        if (dto.idCliente !== undefined) {
            updateData.cliente = dto.idCliente ? ({ id: dto.idCliente } as Cliente) : null;
        }
        await this.proyectoRepository.update(id, updateData);
    }
    async obtener(id: number): Promise<ProyectoDTO> {
        const proyecto = await this.proyectoRepository.findOne({
            where: { id },
            relations: { cliente: true, tareas: { responsable: true } },
        });
        if (!proyecto) throw new NotFoundException('Proyecto no encontrado');
        return {
            id: proyecto.id,
            nombre: proyecto.nombre,
            estado: proyecto.estado as unknown as EstadosProyectosEnum,
            fechaLimite: proyecto.fechaLimite,
            retraso: this.calcularRetraso(proyecto),
            cliente: proyecto.cliente
                ? {
                    id: proyecto.cliente.id,
                    nombre: proyecto.cliente.nombre,
                    cuit: proyecto.cliente.cuit,
                    direccion: proyecto.cliente.direccion,
                    estado: proyecto.cliente.estado,
                }
                : null,
            tareas: proyecto.tareas.map((t) => ({
                id: t.id,
                descripcion: t.descripcion,
                estado: t.estado as unknown as EstadosTareasEnum,
                fechaCreacion: t.fechaCreacion,
                fechaActualizacion: t.fechaActualizacion,
                responsable: t.responsable
                    ? { id: t.responsable.id, nombre: t.responsable.nombre, apellido: t.responsable.apellido }
                    : null,
            })),
        };
    }
    // ── Helpers ──
    private async validarClienteActivo(clienteId: number): Promise<void> {
        const cliente = await this.clienteRepository.findOneBy({ id: clienteId });
        if (!cliente) throw new BadRequestException('Cliente no encontrado');
        if (cliente.estado !== EstadosClientesEnum.ACTIVO) {
            throw new BadRequestException('El cliente debe estar en estado Activo');
        }
    }
    private validarFechaFutura(fecha: Date): void {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        if (fecha <= hoy) {
            throw new BadRequestException('La fecha límite debe ser posterior a hoy');
        }
    }
    private calcularRetraso(proyecto: Proyecto): boolean {
        if (!proyecto.fechaLimite) return false;
        if (proyecto.estado === EstadoProyecto.FINALIZADO) return false;
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const fechaLimite = new Date(proyecto.fechaLimite);
        fechaLimite.setHours(0, 0, 0, 0);
        return fechaLimite.getTime() < hoy.getTime();
    }
}