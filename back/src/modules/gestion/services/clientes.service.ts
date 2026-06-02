import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../entities/cliente.entity';
import { Proyecto } from '../entities/proyecto.entity';
import { CreateClienteDto } from '../dtos/input/create-cliente.dto';
import { UpdateClienteDto } from '../dtos/input/update-cliente.dto';
import { ListClienteDTO } from '../dtos/output/list-cliente.dto';
import { EstadosClientesEnum } from '../enums/estados-clientes.enum';
import { Contacto } from '../entities/contacto.entity';
import { CreateContactoDto } from '../dtos/input/create-contacto.dto';
import { UpdateContactoDto } from '../dtos/input/update-contacto.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(Proyecto)
    private readonly proyectoRepository: Repository<Proyecto>,
    @InjectRepository(Contacto) 
    private readonly contactoRepository: Repository<Contacto>,
  ) {}

  async listar(estado?: EstadosClientesEnum): Promise<ListClienteDTO[]> {
    const where = estado ? { estado } : {};
    return this.clienteRepository.find({ where, select: ['id', 'nombre', 'cuit', 'direccion', 'estado'] });
  }

  async obtenerPorId(id: number): Promise<any> {
    const cliente = await this.clienteRepository.findOne({
      where: { id },
      relations: ['contactos'],
    });
    if (!cliente) throw new NotFoundException('Cliente no encontrado');
    return {
      id: cliente.id,
      nombre: cliente.nombre,
      cuit: cliente.cuit,
      direccion: cliente.direccion,
      estado: cliente.estado,
      contactos: (cliente.contactos ?? []).map(c => ({
        id: c.id,
        tipo: c.tipo,
        valor: c.valor,
        observacion: c.observacion ?? null,
      })),
    };
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

    if (dto.estado === EstadosClientesEnum.BAJA) {
      const proyectosAsociados = await this.proyectoRepository.count({
        where: { cliente: { id } },
      });
      if (proyectosAsociados > 0) {
        throw new BadRequestException(
          'No se puede dar de baja el cliente porque tiene proyectos asociados',
        );
      }
    }
    
    await this.clienteRepository.update(id, dto);
  } 

  async agregarContacto(clienteId: number, dto: CreateContactoDto) {
    const cliente = await this.clienteRepository.findOneBy({ id: clienteId });
    if (!cliente) throw new NotFoundException('Cliente no encontrado');
    
    const contacto = this.contactoRepository.create({ ...dto, cliente });
    const guardado = await this.contactoRepository.save(contacto);
    return { id: guardado.id };
  }

  async modificarContacto(contactoId: number, dto: UpdateContactoDto) {
    const contacto = await this.contactoRepository.findOneBy({ id: contactoId });
    if (!contacto) throw new NotFoundException('Contacto no encontrado');
    
    Object.assign(contacto, dto);
    await this.contactoRepository.save(contacto);
  }

  async eliminarContacto(contactoId: number) {
    const result = await this.contactoRepository.delete(contactoId);
    if (result.affected === 0) throw new NotFoundException('Contacto no encontrado');
  }
}

