import { ApiProperty } from '@nestjs/swagger';
import { EstadoUsuario, RolUsuario } from '../../../auth/entities/usuario.entity';

export class ListUsuarioDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  nombre!: string;

  @ApiProperty({ enum: RolUsuario })
  rol!: RolUsuario;

  @ApiProperty({ enum: EstadoUsuario })
  estado!: EstadoUsuario;
}
