import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Cliente } from './entities/cliente.entity';
import { ClientesController } from './controllers/clientes.controller';
import { ClientesService } from './services/clientes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente]), AuthModule],
  controllers: [ClientesController],
  providers: [ClientesService],
})
export class GestionModule {}
