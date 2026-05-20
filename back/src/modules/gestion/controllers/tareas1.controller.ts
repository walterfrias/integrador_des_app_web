import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateTareaDto } from '../dtos/input/update-tarea.dto';
import { CreateTareaDto } from '../dtos/input/create-tarea.dto';
import { TareasService } from '../services/tareas.service';

@ApiTags('Tareas')
@Controller('proyectos/:idProyecto/tareas')
export class TareasController {
  constructor(private readonly tareasService: TareasService) {}

  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Crear una tarea vinculada a un proyecto (RF10)' })
  async crearTarea(
    @Param('idProyecto') idProyecto: number,
    @Body() dto: CreateTareaDto,
  ): Promise<any> {
    console.log('Proyecto:', idProyecto, 'Datos tarea:', dto);
    return await this.tareasService.crear(Number(idProyecto), dto);
  }

  @ApiBearerAuth()
  @Put(':id')
  @ApiOperation({ summary: 'Modificar los datos o estado de una tarea (RF11)' })
  async actualizarTarea(
    @Param('idProyecto') idProyecto: number,
    @Param('id') id: number,
    @Body() dto: UpdateTareaDto,
  ): Promise<any> {
    console.log('Proyecto:', idProyecto, 'Tarea:', id, 'Nuevos datos:', dto);
    return await this.tareasService.actualizar(Number(id), dto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar físicamente una tarea (RF12)' })
  async eliminarTarea(
    @Param('idProyecto') idProyecto: number,
    @Param('id') id: number,
  ): Promise<void> {
    console.log('Eliminando tarea física. Proyecto:', idProyecto, 'Tarea:', id);
    await this.tareasService.eliminar(Number(id));
  }
}
