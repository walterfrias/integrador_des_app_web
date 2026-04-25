import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../entities/cliente.entity';
import { CreateClienteDto } from '../dtos/input/create-cliente.dto';
import { UpdateClienteDto } from '../dtos/input/update-cliente.dto';
import { ListClienteDTO } from '../dtos/output/list-cliente.dto';
import { EstadosClientesEnum } from '../enums/estados-clientes.enum';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  async listar(estado?: EstadosClientesEnum): Promise<ListClienteDTO[]> {
    const where = estado ? { estado } : {};
    return this.clienteRepository.find({ where, select: ['id', 'nombre', 'estado'] });
  }

  async crear(dto: CreateClienteDto): Promise<{ id: number }> {
    const existe = await this.clienteRepository.findOneBy({ nombre: dto.nombre });
    if (existe) throw new ConflictException('El nombre de cliente ya existe');

    const cliente = this.clienteRepository.create(dto);
    const guardado = await this.clienteRepository.save(cliente);
    return { id: guardado.id };
  }

  async actualizar(id: number, dto: UpdateClienteDto): Promise<void> {
    const cliente = await this.clienteRepository.findOneBy({ id });
    if (!cliente) throw new NotFoundException('Cliente no encontrado');

    await this.clienteRepository.update(id, dto);
  }
}
