import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ClientesService } from '../services/clientes.service';
import { CreateClienteDto } from '../dtos/input/create-cliente.dto';
import { UpdateClienteDto } from '../dtos/input/update-cliente.dto';
import { ListClienteDTO } from '../dtos/output/list-cliente.dto';
import { EstadosClientesEnum } from '../enums/estados-clientes.enum';

@ApiTags('clientes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @ApiOkResponse({ type: ListClienteDTO, isArray: true })
  @Get()
  listar(@Query('estado') estado?: EstadosClientesEnum): Promise<ListClienteDTO[]> {
    return this.clientesService.listar(estado);
  }

  @Post()
  crear(@Body() dto: CreateClienteDto): Promise<{ id: number }> {
    return this.clientesService.crear(dto);
  }

  @Put(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateClienteDto,
  ): Promise<void> {
    return this.clientesService.actualizar(id, dto);
  }
}
