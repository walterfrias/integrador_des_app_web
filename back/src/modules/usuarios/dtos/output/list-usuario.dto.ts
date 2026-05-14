import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoUsuario, RolUsuario } from '../../../auth/entities/usuario.entity';

export class ListUsuarioDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  nombre!: string;

  @ApiPropertyOptional()
  apellido!: string | null;

  @ApiPropertyOptional()
  email!: string | null;

  @ApiPropertyOptional()
  cuil!: string | null;

  @ApiProperty({ enum: RolUsuario })
  rol!: RolUsuario;

  @ApiProperty({ enum: EstadoUsuario })
  estado!: EstadoUsuario;
}
