import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cliente } from './cliente.entity';

export enum TipoContacto {
  TELEFONO = 'TELEFONO',
  EMAIL = 'EMAIL',
}

@Entity('contactos_clientes')
export class Contacto {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'enum', enum: TipoContacto })
  tipo!: TipoContacto;

  @Column()
  valor!: string;

  @ManyToOne(() => Cliente, (cliente) => cliente.contactos, {
    onDelete: 'CASCADE',
  })
  cliente!: Cliente;
}
