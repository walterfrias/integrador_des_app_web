import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { RolUsuario } from '../../../auth/entities/usuario.entity';

export class CreateUsuarioDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre!: string;

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

  @ApiProperty()
  @IsString()
  @MinLength(6)
  clave!: string;

  @ApiProperty({ enum: RolUsuario })
  @IsEnum(RolUsuario)
  rol!: RolUsuario;
}
