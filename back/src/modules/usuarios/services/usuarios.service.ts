import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../../auth/entities/usuario.entity';
import { CreateUsuarioDto } from '../dtos/input/create-usuario.dto';
import { UpdateUsuarioDto } from '../dtos/input/update-usuario.dto';
import { ListUsuarioDto } from '../dtos/output/list-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async listar(): Promise<ListUsuarioDto[]> {
    return this.usuarioRepository.find({
      select: ['id', 'nombre', 'rol', 'estado'],
    });
  }

  async obtenerPorId(id: number): Promise<ListUsuarioDto> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      select: ['id', 'nombre', 'rol', 'estado'],
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return usuario;
  }

  async crear(dto: CreateUsuarioDto): Promise<{ id: number }> {
    const existe = await this.usuarioRepository.findOneBy({ nombre: dto.nombre });
    if (existe) throw new ConflictException('El nombre de usuario ya existe');

    const clave = await bcrypt.hash(dto.clave, 10);
    const usuario = this.usuarioRepository.create({ ...dto, clave });
    const guardado = await this.usuarioRepository.save(usuario);
    return { id: guardado.id };
  }

  async actualizar(id: number, dto: UpdateUsuarioDto, idSolicitante: number): Promise<void> {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    if (dto.estado === 'BAJA' && id === idSolicitante) {
      throw new ForbiddenException('No podés darte de baja a vos mismo');
    }

    if (dto.clave) {
      dto.clave = await bcrypt.hash(dto.clave, 10);
    }

    await this.usuarioRepository.update(id, dto);
  }
}
