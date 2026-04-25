import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { RolUsuario } from '../../../auth/entities/usuario.entity';

export class CreateUsuarioDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  clave!: string;

  @ApiProperty({ enum: RolUsuario })
  @IsEnum(RolUsuario)
  rol!: RolUsuario;
}
