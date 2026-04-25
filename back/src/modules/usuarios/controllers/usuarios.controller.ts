import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UsuariosService } from '../services/usuarios.service';
import { CreateUsuarioDto } from '../dtos/input/create-usuario.dto';
import { UpdateUsuarioDto } from '../dtos/input/update-usuario.dto';
import { ListUsuarioDto } from '../dtos/output/list-usuario.dto';

@ApiTags('usuarios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @ApiOkResponse({ type: ListUsuarioDto, isArray: true })
  @Get()
  async listar(): Promise<ListUsuarioDto[]> {
    return this.usuariosService.listar();
  }

  @Post()
  async crear(@Body() dto: CreateUsuarioDto): Promise<{ id: number }> {
    return this.usuariosService.crear(dto);
  }

  @Put(':id')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUsuarioDto,
    @Req() req: Request,
  ): Promise<void> {
    const idSolicitante = (req['user'] as { sub: number }).sub;
    return this.usuariosService.actualizar(id, dto, idSolicitante);
  }
}
