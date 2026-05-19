import { ApiProperty } from '@nestjs/swagger';

export class TareasPorResponsableDto {
  @ApiProperty() usuarioId!: number;
  @ApiProperty() nombre!: string;
  @ApiProperty() apellido!: string | null;
  @ApiProperty() total!: number;
}

export class TareaEstadoUsuarioDto {
  @ApiProperty() nombre!: string;
  @ApiProperty() apellido!: string | null;
  @ApiProperty() pendientes!: number;
  @ApiProperty() finalizadas!: number;
}

export class SerieSemanalDto {
  @ApiProperty() nombre!: string;
  @ApiProperty({ type: [Number] }) datos!: number[];
}

export class ActividadSemanalDto {
  @ApiProperty({ type: [String] }) semanas!: string[];
  @ApiProperty({ type: [SerieSemanalDto] }) series!: SerieSemanalDto[];
}

export class StatsDto {
  @ApiProperty() proyectosActivos!: number;
  @ApiProperty() proyectosFinalizados!: number;
  @ApiProperty() proyectosBaja!: number;
  @ApiProperty() proyectosRetrasados!: number;

  @ApiProperty() tareasPendientes!: number;
  @ApiProperty() tareasFinalizadas!: number;
  @ApiProperty() tareasBaja!: number;

  @ApiProperty() clientesActivos!: number;
  @ApiProperty() usuariosActivos!: number;

  @ApiProperty({ type: [TareasPorResponsableDto] })
  tareasPorResponsable!: TareasPorResponsableDto[];

  @ApiProperty({ type: [TareaEstadoUsuarioDto] })
  tareasPorUsuarioEstado!: TareaEstadoUsuarioDto[];
}
