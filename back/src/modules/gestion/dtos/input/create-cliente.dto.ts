import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

const CUIT_REGEX = /^\d{2}-\d{6}-\d{2}$/;

export class CreateClienteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiPropertyOptional({ example: '20-123456-78' })
  @IsString()
  @IsOptional()
  @Matches(CUIT_REGEX, { message: 'El CUIT debe tener el formato XX-XXXXXX-XX' })
  cuit?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  direccion?: string;
}
