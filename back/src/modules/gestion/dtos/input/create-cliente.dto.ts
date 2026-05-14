import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClienteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  cuit?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  direccion?: string;
}
