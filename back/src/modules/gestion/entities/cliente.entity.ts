import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Contacto } from './contacto.entity';
import { Proyecto } from './proyecto.entity';

export enum EstadoCliente {
  ACTIVO = 'ACTIVO',
  BAJA = 'BAJA',
}

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  nombre!: string;

  @Column({ type: 'enum', enum: EstadoCliente, default: EstadoCliente.ACTIVO })
  estado!: EstadoCliente;

  @OneToMany(() => Contacto, (contacto) => contacto.cliente, { cascade: true })
  contactos!: Contacto[];

  @OneToMany(() => Proyecto, (proyecto) => proyecto.cliente)
  proyectos!: Proyecto[];
}
