import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { EstadoUsuario, RolUsuario } from '../../../auth/entities/usuario.entity';

export class UpdateUsuarioDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  nombre?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  apellido?: string;

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  cuil?: string;

  @ApiPropertyOptional()
  @IsString()
  @MinLength(6)
  @IsOptional()
  clave?: string;

  @ApiPropertyOptional({ enum: RolUsuario })
  @IsEnum(RolUsuario)
  @IsOptional()
  rol?: RolUsuario;

  @ApiPropertyOptional({ enum: EstadoUsuario })
  @IsEnum(EstadoUsuario)
  @IsOptional()
  estado?: EstadoUsuario;
}
