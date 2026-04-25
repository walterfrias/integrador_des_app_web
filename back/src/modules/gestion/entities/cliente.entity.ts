import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Contacto } from './contacto.entity';
import { Proyecto } from './proyecto.entity';
import { EstadosClientesEnum } from '../enums/estados-clientes.enum';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  nombre!: string;

  @Column({ type: 'enum', enum: EstadosClientesEnum, default: EstadosClientesEnum.ACTIVO })
  estado!: EstadosClientesEnum;

  @OneToMany(() => Contacto, (contacto) => contacto.cliente, { cascade: true })
  contactos!: Contacto[];

  @OneToMany(() => Proyecto, (proyecto) => proyecto.cliente)
  proyectos!: Proyecto[];
}
