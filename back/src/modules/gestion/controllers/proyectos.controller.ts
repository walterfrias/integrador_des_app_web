import {
  Body,
  Controller,
  Get,
  NotImplementedException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateProyectoDto } from '../dtos/input/create-proyecto.dto';
import { UpdateProyectoDto } from '../dtos/input/update-proyecto.dto';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { ListProyectoDTO } from '../dtos/output/list-proyecto.dto';
import { ProyectoDTO } from '../dtos/output/proyecto.dto';

@Controller('proyectos')
export class ProyectosController {
  constructor() {}

  @ApiBearerAuth()
  @Post()
  async crearProyecto(@Body() dto: CreateProyectoDto): Promise<{ id: number }> {
    console.log('Datos recibidos para crear:', dto);
    return await Promise.reject(new NotImplementedException());
  }

  @ApiBearerAuth()
  @Put(':id')
  async actualizarProyecto(
    @Body() dto: UpdateProyectoDto,
    @Param('id') id: number,
  ): Promise<void> {
    console.log('Actualizando ID:', id, 'con datos:', dto);
    return await Promise.reject(new NotImplementedException());
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: ListProyectoDTO, isArray: true })
  @Get()
  async obtenerProyectos(): Promise<ListProyectoDTO[]> {
    console.log('Listando todos los proyectos');
    return await Promise.reject(new NotImplementedException());
  }

  @ApiBearerAuth()
  @Get(':id')
  async obtenerProyecto(@Param('id') id: number): Promise<ProyectoDTO> {
    console.log('Buscando proyecto con ID:', id);
    return await Promise.reject(new NotImplementedException());
  }
}
