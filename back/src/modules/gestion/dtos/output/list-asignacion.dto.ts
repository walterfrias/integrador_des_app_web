import { ApiProperty } from '@nestjs/swagger';
import { EstadoAsignacion } from '../../enums/estados-asignacion.enum';

export class ListAsignacionDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  usuarioId!: number;

  @ApiProperty()
  usuarioNombre!: string;

  @ApiProperty()
  proyectoId!: number;

  @ApiProperty()
  proyectoNombre!: string;

  @ApiProperty({ enum: EstadoAsignacion })
  estado!: EstadoAsignacion;

  @ApiProperty()
  fechaAsignacion!: Date;
}
