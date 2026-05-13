import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Cliente } from './entities/cliente.entity';
import { Proyecto } from './entities/proyecto.entity';
import { AsignacionProyecto } from './entities/asignacion-proyecto.entity';
import { Usuario } from '../auth/entities/usuario.entity';
import { ClientesController } from './controllers/clientes.controller';
import { AsignacionesController } from './controllers/asignaciones.controller';
import { ClientesService } from './services/clientes.service';
import { AsignacionesService } from './services/asignaciones.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente, Proyecto, AsignacionProyecto, Usuario]), AuthModule],
  controllers: [ClientesController, AsignacionesController],
  providers: [ClientesService, AsignacionesService],
})
export class GestionModule {}
