import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadosClientesEnum } from '../../enums/estados-clientes.enum';

export class ListClienteDTO {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  nombre!: string;

  @ApiPropertyOptional()
  cuit!: string | null;

  @ApiPropertyOptional()
  direccion!: string | null;

  @ApiProperty()
  estado!: EstadosClientesEnum;
}
