import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadosTareasEnum } from '../../enums/estados-tareas.enum';
import { PrioridadTarea } from '../../entities/tarea.entity';

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

  @ApiProperty({ enum: PrioridadTarea })
  prioridad!: PrioridadTarea;

  @ApiPropertyOptional()
  fechaLimite!: Date | null;

  @ApiProperty()
  fechaCreacion!: Date;

  @ApiProperty()
  fechaActualizacion!: Date;

  @ApiPropertyOptional({ type: ResponsableTareaDTO })
  responsable?: ResponsableTareaDTO | null;
}
