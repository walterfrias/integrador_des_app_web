import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadosTareasEnum } from '../../enums/estados-tareas.enum';

export class ResponsableTareaDTO {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  nombre!: string;

  @ApiPropertyOptional()
  apellido?: string | null;
}

export class ListTareaDTO {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  descripcion!: string;

  @ApiProperty({ enum: EstadosTareasEnum })
  estado!: EstadosTareasEnum;

  @ApiProperty()
  fechaCreacion!: Date;

  @ApiProperty()
  fechaActualizacion!: Date;

  @ApiPropertyOptional({ type: ResponsableTareaDTO })
  responsable?: ResponsableTareaDTO | null;
}
