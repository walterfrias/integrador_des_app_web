import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Cliente } from '../entities/cliente.entity';
import { Proyecto, EstadoProyecto } from '../entities/proyecto.entity';
import { Tarea, EstadoTarea } from '../entities/tarea.entity';
import { Usuario, EstadoUsuario } from '../../auth/entities/usuario.entity';
import { EstadosClientesEnum } from '../enums/estados-clientes.enum';
import {
  StatsDto,
  TareasPorResponsableDto,
  TareaEstadoUsuarioDto,
  ActividadSemanalDto,
  CreadasVsFinalizadasDto,
  DetalleUsuarioDto,
} from '../dtos/output/stats.dto';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Cliente)   private clienteRepo:  Repository<Cliente>,
    @InjectRepository(Proyecto)  private proyectoRepo: Repository<Proyecto>,
    @InjectRepository(Tarea)     private tareaRepo:    Repository<Tarea>,
    @InjectRepository(Usuario)   private usuarioRepo:  Repository<Usuario>,
  ) {}

  async getStats(): Promise<StatsDto> {
    const hoy = new Date();

    const [
      proyectosActivos,
      proyectosFinalizados,
      proyectosBaja,
      proyectosRetrasados,
      tareasPendientes,
      tareasFinalizadas,
      tareasBaja,
      clientesActivos,
      usuariosActivos,
      tareasPorResponsableRaw,
      tareasPorUsuarioEstadoRaw,
    ] = await Promise.all([
      this.proyectoRepo.countBy({ estado: EstadoProyecto.ACTIVO }),
      this.proyectoRepo.countBy({ estado: EstadoProyecto.FINALIZADO }),
      this.proyectoRepo.countBy({ estado: EstadoProyecto.BAJA }),
      this.proyectoRepo.countBy({ estado: EstadoProyecto.ACTIVO, fechaLimite: LessThan(hoy) }),
      this.tareaRepo.countBy({ estado: EstadoTarea.PENDIENTE }),
      this.tareaRepo.countBy({ estado: EstadoTarea.FINALIZADA }),
      this.tareaRepo.countBy({ estado: EstadoTarea.BAJA }),
      this.clienteRepo.countBy({ estado: EstadosClientesEnum.ACTIVO }),
      this.usuarioRepo.countBy({ estado: EstadoUsuario.ACTIVO }),
      this.tareaRepo
        .createQueryBuilder('tarea')
        .select('usuario.id', 'usuarioId')
        .addSelect('usuario.nombre', 'nombre')
        .addSelect('usuario.apellido', 'apellido')
        .addSelect('COUNT(tarea.id)', 'total')
        .innerJoin('tarea.responsable', 'usuario')
        .groupBy('usuario.id')
        .addGroupBy('usuario.nombre')
        .addGroupBy('usuario.apellido')
        .orderBy('total', 'DESC')
        .getRawMany<TareasPorResponsableDto>(),
      this.tareaRepo
        .createQueryBuilder('t')
        .select('u.id', 'id')
        .addSelect('u.nombre', 'nombre')
        .addSelect('u.apellido', 'apellido')
        .addSelect(`COUNT(CASE WHEN t.estado = 'PENDIENTE' THEN 1 END)`, 'pendientes')
        .addSelect(`COUNT(CASE WHEN t.estado = 'FINALIZADA' THEN 1 END)`, 'finalizadas')
        .innerJoin('t.responsable', 'u')
        .where("u.estado = :estado", { estado: EstadoUsuario.ACTIVO })
        .groupBy('u.id')
        .addGroupBy('u.nombre')
        .addGroupBy('u.apellido')
        .orderBy('u.nombre', 'ASC')
        .getRawMany<{ id: number; nombre: string; apellido: string | null; pendientes: string; finalizadas: string }>(),
    ]);

    return {
      proyectosActivos,
      proyectosFinalizados,
      proyectosBaja,
      proyectosRetrasados,
      tareasPendientes,
      tareasFinalizadas,
      tareasBaja,
      clientesActivos,
      usuariosActivos,
      tareasPorResponsable: tareasPorResponsableRaw.map((r) => ({
        ...r,
        total: Number(r.total),
      })),
      tareasPorUsuarioEstado: tareasPorUsuarioEstadoRaw.map((r): TareaEstadoUsuarioDto => ({
        usuarioId: Number(r.id),
        nombre: r.nombre,
        apellido: r.apellido,
        pendientes: Number(r.pendientes),
        finalizadas: Number(r.finalizadas),
      })),
    };
  }

  async getActividadSemanal(): Promise<ActividadSemanalDto> {
    const raw = await this.tareaRepo
      .createQueryBuilder('t')
      .select("TO_CHAR(DATE_TRUNC('week', t.fecha_creacion), 'YYYY-MM-DD')", 'semana')
      .addSelect('u.nombre', 'nombre')
      .addSelect('u.apellido', 'apellido')
      .addSelect('COUNT(t.id)', 'total')
      .innerJoin('t.responsable', 'u')
      .where("t.estado = 'FINALIZADA'")
      .andWhere("u.estado = :estado", { estado: EstadoUsuario.ACTIVO })
      .groupBy("DATE_TRUNC('week', t.fecha_creacion)")
      .addGroupBy('u.nombre')
      .addGroupBy('u.apellido')
      .orderBy("DATE_TRUNC('week', t.fecha_creacion)", 'ASC')
      .getRawMany<{ semana: string; nombre: string; apellido: string | null; total: string }>();

    const semanas = [...new Set(raw.map((r) => r.semana))].sort();
    const nombresUsuarios = [
      ...new Set(raw.map((r) => (r.apellido ? `${r.nombre} ${r.apellido}` : r.nombre))),
    ];

    const series = nombresUsuarios.map((nombreCompleto) => ({
      nombre: nombreCompleto,
      datos: semanas.map((semana) => {
        const entry = raw.find((r) => {
          const fullName = r.apellido ? `${r.nombre} ${r.apellido}` : r.nombre;
          return fullName === nombreCompleto && r.semana === semana;
        });
        return entry ? Number(entry.total) : 0;
      }),
    }));

    return { semanas, series };
  }

  async getDetalleUsuario(id: number): Promise<DetalleUsuarioDto> {
    const [usuario, tareas] = await Promise.all([
      this.usuarioRepo.findOneByOrFail({ id }),
      this.tareaRepo.find({
        where: { responsable: { id } },
        relations: ['proyecto'],
        order: { fechaCreacion: 'ASC' },
      }),
    ]);

    const proyectosMap = new Map<number, DetalleUsuarioDto['proyectos'][number]>();
    for (const t of tareas) {
      if (!proyectosMap.has(t.proyecto.id)) {
        proyectosMap.set(t.proyecto.id, {
          id: t.proyecto.id,
          nombre: t.proyecto.nombre,
          estado: t.proyecto.estado,
          tareas: [],
        });
      }
      proyectosMap.get(t.proyecto.id)!.tareas.push({
        id: t.id,
        descripcion: t.descripcion,
        estado: t.estado,
        fechaCreacion: t.fechaCreacion,
      });
    }

    return {
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido ?? null,
      proyectos: [...proyectosMap.values()],
    };
  }

  async getCreadasVsFinalizadas(): Promise<CreadasVsFinalizadasDto> {
    const [rawCreadas, rawFinalizadas] = await Promise.all([
      this.tareaRepo
        .createQueryBuilder('t')
        .select("TO_CHAR(DATE_TRUNC('week', t.fecha_creacion), 'YYYY-MM-DD')", 'semana')
        .addSelect('COUNT(t.id)', 'total')
        .groupBy("DATE_TRUNC('week', t.fecha_creacion)")
        .orderBy("DATE_TRUNC('week', t.fecha_creacion)", 'ASC')
        .getRawMany<{ semana: string; total: string }>(),
      this.tareaRepo
        .createQueryBuilder('t')
        .select("TO_CHAR(DATE_TRUNC('week', t.fecha_creacion), 'YYYY-MM-DD')", 'semana')
        .addSelect('COUNT(t.id)', 'total')
        .where("t.estado = 'FINALIZADA'")
        .groupBy("DATE_TRUNC('week', t.fecha_creacion)")
        .orderBy("DATE_TRUNC('week', t.fecha_creacion)", 'ASC')
        .getRawMany<{ semana: string; total: string }>(),
    ]);

    const semanas = [
      ...new Set([...rawCreadas.map(r => r.semana), ...rawFinalizadas.map(r => r.semana)]),
    ].sort();

    const mapCreadas = new Map(rawCreadas.map(r => [r.semana, Number(r.total)]));
    const mapFinalizadas = new Map(rawFinalizadas.map(r => [r.semana, Number(r.total)]));

    return {
      semanas,
      creadas: semanas.map(s => mapCreadas.get(s) ?? 0),
      finalizadas: semanas.map(s => mapFinalizadas.get(s) ?? 0),
    };
  }
}
