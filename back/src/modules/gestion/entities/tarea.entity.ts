import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Proyecto } from './proyecto.entity';
import { Usuario } from '../../auth/entities/usuario.entity';

export enum EstadoTarea {
  PENDIENTE = 'PENDIENTE',
  FINALIZADA = 'FINALIZADA',
  BAJA = 'BAJA',
}

@Entity('tareas')
export class Tarea {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  descripcion!: string;

  @Column({ type: 'enum', enum: EstadoTarea, default: EstadoTarea.PENDIENTE })
  estado!: EstadoTarea;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion!: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion!: Date;

  @ManyToOne(() => Proyecto, (proyecto) => proyecto.tareas, {
    onDelete: 'CASCADE',
  })
  proyecto!: Proyecto;

  @ManyToOne(() => Usuario, (usuario) => usuario.tareas, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'usuario_id' })
  responsable?: Usuario | null;
}
