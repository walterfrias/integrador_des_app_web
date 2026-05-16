import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { EstadoAsignacion } from '../../enums/estados-asignacion.enum';

export class UpdateAsignacionDto {
  @ApiProperty({ enum: EstadoAsignacion })
  @IsEnum(EstadoAsignacion)
  estado!: EstadoAsignacion;
}
