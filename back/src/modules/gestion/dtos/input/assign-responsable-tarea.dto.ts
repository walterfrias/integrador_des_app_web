import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class AssignResponsableTareaDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  usuarioId!: number;
}
