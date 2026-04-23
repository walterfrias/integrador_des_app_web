import {
  Body,
  Controller,
  Get,
  NotImplementedException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateClienteDto } from '../dtos/input/create-cliente.dto';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { ListClienteDTO } from '../dtos/output/list-cliente.dto';
import { UpdateClienteDto } from '../dtos/input/update-cliente.dto';
import { EstadosClientesEnum } from '../enums/estados-clientes.enum';

@Controller('clientes')
export class ClientesController {
  constructor() {}

  @ApiBearerAuth()
  @Post()
  crearCliente(@Body() dto: CreateClienteDto): Promise<{ id: number }> {
    console.log(dto);
    throw new NotImplementedException();
  }

  @ApiBearerAuth()
  @Put(':id')
  actualizarCliente(
    @Param('id') id: number,
    @Body() dto: UpdateClienteDto,
  ): Promise<void> {
    console.log(id, dto);
    throw new NotImplementedException();
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: ListClienteDTO, isArray: true })
  @Get()
  obtenerClientes(
    @Query('estado') estado: EstadosClientesEnum,
  ): Promise<ListClienteDTO[]> {
    console.log(estado);
    throw new NotImplementedException();
  }
}
