import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AsignacionProyecto } from '../entities/asignacion-proyecto.entity';
import { Usuario } from '../../auth/entities/usuario.entity';
import { Proyecto } from '../entities/proyecto.entity';
import { CreateAsignacionDto } from '../dtos/input/create-asignacion.dto';
import { UpdateAsignacionDto } from '../dtos/input/update-asignacion.dto';
import { ListAsignacionDto } from '../dtos/output/list-asignacion.dto';
import { EstadoAsignacion } from '../enums/estados-asignacion.enum';

@Injectable()
export class AsignacionesService {
  constructor(
    @InjectRepository(AsignacionProyecto)
    private readonly asignacionRepository: Repository<AsignacionProyecto>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Proyecto)
    private readonly proyectoRepository: Repository<Proyecto>,
  ) {}

  async listar(proyectoId?: number): Promise<ListAsignacionDto[]> {
    const query = this.asignacionRepository
      .createQueryBuilder('a')
      .innerJoin('a.usuario', 'u')
      .innerJoin('a.proyecto', 'p')
      .select([
        'a.id', 'a.estado', 'a.fechaAsignacion',
        'u.id', 'u.nombre',
        'p.id', 'p.nombre',
      ]);

    if (proyectoId) query.where('p.id = :proyectoId', { proyectoId });

    const rows = await query.getMany();

    return rows.map((a) => ({
      id: a.id,
      usuarioId: a.usuario.id,
      usuarioNombre: a.usuario.nombre,
      proyectoId: a.proyecto.id,
      proyectoNombre: a.proyecto.nombre,
      estado: a.estado,
      fechaAsignacion: a.fechaAsignacion,
    }));
  }

  async asignar(dto: CreateAsignacionDto): Promise<{ id: number }> {
    const usuario = await this.usuarioRepository.findOneBy({ id: dto.usuarioId });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const proyecto = await this.proyectoRepository.findOneBy({ id: dto.proyectoId });
    if (!proyecto) throw new NotFoundException('Proyecto no encontrado');

    const existente = await this.asignacionRepository.findOne({
      where: { usuario: { id: dto.usuarioId }, proyecto: { id: dto.proyectoId } },
    });
    if (existente) {
      if (existente.estado === EstadoAsignacion.ACTIVO) {
        throw new ConflictException('El usuario ya está asignado a este proyecto');
      }
      await this.asignacionRepository.update(existente.id, { estado: EstadoAsignacion.ACTIVO });
      return { id: existente.id };
    }

    const asignacion = this.asignacionRepository.create({ usuario, proyecto });
    const guardada = await this.asignacionRepository.save(asignacion);
    return { id: guardada.id };
  }

  async actualizar(id: number, dto: UpdateAsignacionDto): Promise<void> {
    const asignacion = await this.asignacionRepository.findOneBy({ id });
    if (!asignacion) throw new NotFoundException('Asignación no encontrada');

    await this.asignacionRepository.update(id, { estado: dto.estado });
  }
}
