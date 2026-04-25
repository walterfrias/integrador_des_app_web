import {
  Body,
  Controller,
  NotImplementedException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UpdateTareaDto } from '../dtos/input/update-tarea.dto';
import { CreateTareaDto } from '../dtos/input/create-tarea.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
// import { TareasService } from '../services/tarea.service';

@Controller('proyectos/:idProyecto/tareas')
export class TareasController {
  constructor() {}

  @ApiBearerAuth()
  @Post()
  async crearTarea(
    @Param('idProyecto') idProyecto: number,
    @Body() dto: CreateTareaDto,
  ): Promise<any> {
    console.log('Proyecto:', idProyecto, 'Datos tarea:', dto);
    return await Promise.reject(new NotImplementedException());
  }

  @ApiBearerAuth()
  @Put(':id')
  async actualizarTarea(
    @Param('idProyecto') idProyecto: number,
    @Param('id') id: number,
    @Body() dto: UpdateTareaDto,
  ): Promise<any> {
    console.log('Proyecto:', idProyecto, 'Tarea:', id, 'Nuevos datos:', dto);
    return await Promise.reject(new NotImplementedException());
  }
}
