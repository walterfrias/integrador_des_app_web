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
import { AsignacionesService } from '../services/asignaciones.service';
import { CreateAsignacionDto } from '../dtos/input/create-asignacion.dto';
import { UpdateAsignacionDto } from '../dtos/input/update-asignacion.dto';
import { ListAsignacionDto } from '../dtos/output/list-asignacion.dto';

@ApiTags('asignaciones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('asignaciones')
export class AsignacionesController {
  constructor(private readonly asignacionesService: AsignacionesService) {}

  @ApiOkResponse({ type: ListAsignacionDto, isArray: true })
  @Get()
  listar(@Query('proyectoId', new ParseIntPipe({ optional: true })) proyectoId?: number): Promise<ListAsignacionDto[]> {
    return this.asignacionesService.listar(proyectoId);
  }

  @Post()
  asignar(@Body() dto: CreateAsignacionDto): Promise<{ id: number }> {
    return this.asignacionesService.asignar(dto);
  }

  @Put(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAsignacionDto,
  ): Promise<void> {
    return this.asignacionesService.actualizar(id, dto);
  }
}
