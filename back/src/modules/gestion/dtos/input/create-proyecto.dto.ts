import { ApiProperty } from '@nestjs/swagger';
// import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

// export class CreateProyectoDto {
//   @ApiProperty()
//   @IsString()
//   @IsNotEmpty()
//   nombre!: string;

//   @ApiProperty()
//   @IsNumber()
//   @IsOptional()
//   idCliente!: number;
// }

import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { EstadosProyectosEnum } from '../../enums/estados-proyectos.enum';
export class CreateProyectoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre!: string;
  @ApiProperty({ enum: EstadosProyectosEnum, default: EstadosProyectosEnum.ACTIVO, required: false })
  @IsEnum(EstadosProyectosEnum)
  @IsOptional()
  estado?: EstadosProyectosEnum;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  idCliente?: number;
  @ApiProperty({ required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  fechaLimite?: Date;
}