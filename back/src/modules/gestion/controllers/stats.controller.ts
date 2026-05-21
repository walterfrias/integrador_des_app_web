import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { StatsService } from '../services/stats.service';
import { StatsDto, ActividadSemanalDto, CreadasVsFinalizadasDto, DetalleUsuarioDto } from '../dtos/output/stats.dto';

@ApiTags('stats')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  @ApiOkResponse({ type: StatsDto })
  getStats(): Promise<StatsDto> {
    return this.statsService.getStats();
  }

  @Get('actividad-semanal')
  @ApiOkResponse({ type: ActividadSemanalDto })
  getActividadSemanal(): Promise<ActividadSemanalDto> {
    return this.statsService.getActividadSemanal();
  }

  @Get('creadas-vs-finalizadas')
  @ApiOkResponse({ type: CreadasVsFinalizadasDto })
  getCreadasVsFinalizadas(): Promise<CreadasVsFinalizadasDto> {
    return this.statsService.getCreadasVsFinalizadas();
  }

  @Get('usuario/:id')
  @ApiOkResponse({ type: DetalleUsuarioDto })
  getDetalleUsuario(@Param('id', ParseIntPipe) id: number): Promise<DetalleUsuarioDto> {
    return this.statsService.getDetalleUsuario(id);
  }
}
