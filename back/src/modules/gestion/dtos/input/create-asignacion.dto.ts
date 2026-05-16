import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class CreateAsignacionDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  usuarioId!: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  proyectoId!: number;
}
