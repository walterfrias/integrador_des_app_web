import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../entities/usuario.entity';
import { LoginDto } from '../dtos/input/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const usuario = await this.usuarioRepository
      .createQueryBuilder('u')
      .addSelect('u.clave')
      .where('u.nombre = :nombre', { nombre: dto.nombre })
      .getOne();

    if (!usuario) throw new UnauthorizedException('Credenciales inválidas');
    if (usuario.estado === 'BAJA') throw new UnauthorizedException('Usuario dado de baja');

    const claveValida = await bcrypt.compare(dto.clave, usuario.clave);
    if (!claveValida) throw new UnauthorizedException('Credenciales inválidas');

    const payload = { sub: usuario.id, nombre: usuario.nombre, rol: usuario.rol };
    return { accessToken: this.jwtService.sign(payload) };
  }
}
