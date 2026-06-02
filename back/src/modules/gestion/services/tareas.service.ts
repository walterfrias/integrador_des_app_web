import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Tarea, EstadoTarea } from '../entities/tarea.entity';
import { Usuario } from '../../auth/entities/usuario.entity';
import { CreateTareaDto } from '../dtos/input/create-tarea.dto';
import { UpdateTareaDto } from '../dtos/input/update-tarea.dto';

@Injectable()
export class TareasService {
  constructor(
    @InjectRepository(Tarea)
    private readonly tareaRepository: Repository<Tarea>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  // Crear tarea vinculada a un proyecto específico
  async crear(proyectoId: number, dto: CreateTareaDto): Promise<Tarea> {
    const estadoInput =
      dto && 'estado' in dto
        ? (dto as Record<string, unknown>).estado
        : undefined;

    const estadoValido = Object.values(EstadoTarea).includes(
      estadoInput as EstadoTarea,
    )
      ? (estadoInput as EstadoTarea)
      : EstadoTarea.PENDIENTE;

    const nuevaTarea = this.tareaRepository.create({
      descripcion: String(dto.descripcion || ''),
      estado: estadoValido,
    });

    nuevaTarea.proyecto = { id: Number(proyectoId) } as Tarea['proyecto'];

    console.log(
      `Guardando en BD -> Proyecto: ${proyectoId}, Tarea: ${nuevaTarea.descripcion}`,
    );
    return await this.tareaRepository.save(nuevaTarea);
  }

  // Listar tareas de un proyecto
  async listarPorProyecto(
    proyectoId: number,
    responsableId?: number,
  ): Promise<Tarea[]> {
    const queryBuilder = this.tareaRepository
      .createQueryBuilder('tarea')
      .leftJoinAndSelect('tarea.proyecto', 'proyecto')
      .leftJoinAndSelect('tarea.responsable', 'responsable')
      .where('proyecto.id = :proyectoId', { proyectoId });

    if (responsableId) {
      queryBuilder.andWhere('responsable.id = :responsableId', {
        responsableId,
      });
    }

    queryBuilder.orderBy('tarea.id', 'ASC');
    return await queryBuilder.getMany();
  }

  async listarTodas(): Promise<Tarea[]> {
    return await this.tareaRepository
      .createQueryBuilder('tarea')
      .leftJoinAndSelect('tarea.proyecto', 'proyecto')
      .leftJoinAndSelect('tarea.responsable', 'responsable')
      .orderBy('tarea.id', 'ASC')
      .getMany();
  }
  // Modificar los datos o el estado de la tarea
  async actualizar(tareaId: number, dto: UpdateTareaDto): Promise<Tarea> {
    const filtro: FindOptionsWhere<Tarea> = { id: Number(tareaId) };
    const tarea = await this.tareaRepository.findOne({
      where: filtro,
    });

    if (!tarea) {
      throw new NotFoundException(`La tarea con ID ${tareaId} no existe`);
    }

    this.tareaRepository.merge(tarea, dto as any);
    return await this.tareaRepository.save(tarea);
  }
  // Asignar un responsable validando que el usuario esté ACTIVO
  async asignarResponsable(tareaId: number, usuarioId: number): Promise<Tarea> {
    const filtroTarea: FindOptionsWhere<Tarea> = { id: Number(tareaId) };
    const tarea = await this.tareaRepository.findOne({
      where: filtroTarea,
    });
    if (!tarea) throw new NotFoundException('Tarea no encontrada');

    const filtroUsuario: FindOptionsWhere<Usuario> = { id: Number(usuarioId) };
    const usuario = await this.usuarioRepository.findOne({
      where: filtroUsuario,
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const datosUsuario = usuario as Record<string, any>;
    if (String(datosUsuario.estado) !== 'ACTIVO') {
      throw new BadRequestException('El usuario debe estar ACTIVO');
    }

    tarea.responsable = usuario;
    return await this.tareaRepository.save(tarea);
  }

  // Quitar responsable
  async quitarResponsable(tareaId: number): Promise<Tarea> {
    const filtro: FindOptionsWhere<Tarea> = { id: Number(tareaId) };
    const tarea = await this.tareaRepository.findOne({
      where: filtro,
      relations: ['responsable'],
    });

    if (!tarea) {
      throw new NotFoundException(`La tarea con ID ${tareaId} no existe`);
    }

    tarea.responsable = null;
    return await this.tareaRepository.save(tarea);
  }

  // Eliminar físicamente la tarea
  async eliminar(tareaId: number): Promise<void> {
    const resultado = await this.tareaRepository.delete(Number(tareaId));
    if (resultado.affected === 0) {
      throw new NotFoundException(
        `No se encontró la tarea con ID ${tareaId} para eliminar`,
      );
    }
  }
}
