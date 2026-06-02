import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TareasService } from '../services/tareas.service';
import { CreateTareaDto } from '../dtos/input/create-tarea.dto';
import { UpdateTareaDto } from '../dtos/input/update-tarea.dto';

@ApiTags('Tareas')
@Controller('proyectos/:idProyecto/tareas')
export class TareasController {
  constructor(private readonly tareasService: TareasService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las tareas con 0 o con id' })
  async obtenerTareas(@Param('idProyecto') idProyecto: string) {
    const idNum = Number(idProyecto);

    if (idNum === 0) {
      return await this.tareasService.listarTodas();
    }
    return await this.tareasService.listarPorProyecto(idNum);
  }

  @Post()
  @Header('Access-Control-Allow-Origin', '*')
  @ApiOperation({ summary: 'Crear nueva tarea' })
  async crear(@Param('idProyecto') id: number, @Body() dto: CreateTareaDto) {
    return await this.tareasService.crear(id, dto);
  }

  @Put(':id')
  @Header('Access-Control-Allow-Origin', '*')
  @ApiOperation({ summary: 'Actualizar tarea' })
  async actualizar(@Param('id') id: number, @Body() dto: UpdateTareaDto) {
    return await this.tareasService.actualizar(id, dto);
  }

  @Delete(':id')
  @Header('Access-Control-Allow-Origin', '*')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar tarea' })
  async eliminar(@Param('id') id: number) {
    return await this.tareasService.eliminar(id);
  }

  @Patch(':id/responsable')
  @ApiOperation({ summary: 'Asignar responsable a tarea (RF31)' })
  async asignarResponsable(
    @Param('id') id: number,
    @Body() body: { usuarioId: number },
  ) {
    return await this.tareasService.asignarResponsable(id, body.usuarioId);
  }

  @Delete(':id/responsable')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Quitar responsable de tarea (RF32)' })
  async quitarResponsable(@Param('id') id: number) {
    return await this.tareasService.quitarResponsable(id);
  }
}
