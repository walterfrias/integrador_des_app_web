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
import { CreateProyectoDto } from '../dtos/input/create-proyecto.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ProyectosService } from '../services/proyectos.service';
import { UpdateProyectoDto } from '../dtos/input/update-proyecto.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ListProyectoDTO } from '../dtos/output/list-proyecto.dto';
import { ProyectoDTO } from '../dtos/output/proyecto.dto';
import { EstadosProyectosEnum } from '../enums/estados-proyectos.enum';

@ApiTags('proyectos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('proyectos')
export class ProyectosController {
  constructor(private readonly proyectosService: ProyectosService) {}
  @ApiOkResponse({ type: ListProyectoDTO, isArray: true })
  @Get()
  listar(
    @Query('estado') estado?: EstadosProyectosEnum,
  ): Promise<ListProyectoDTO[]> {
    return this.proyectosService.listar(estado);
  }
  @Post()
  crear(@Body() dto: CreateProyectoDto): Promise<{ id: number }> {
    return this.proyectosService.crear(dto);
  }
  @Put(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProyectoDto,
  ): Promise<void> {
    return this.proyectosService.actualizar(id, dto);
  }
  @ApiOkResponse({ type: ProyectoDTO })
  @Get(':id')
  obtener(@Param('id', ParseIntPipe) id: number): Promise<ProyectoDTO> {
    return this.proyectosService.obtener(id);
  }
}
