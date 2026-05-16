import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cliente } from './cliente.entity';
import { Tarea } from './tarea.entity';
import { AsignacionProyecto } from './asignacion-proyecto.entity';

export enum EstadoProyecto {
  ACTIVO = 'ACTIVO',
  FINALIZADO = 'FINALIZADO',
  BAJA = 'BAJA',
}

@Entity('proyectos')
export class Proyecto {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  nombre!: string;

  @Column({ type: 'enum', enum: EstadoProyecto, default: EstadoProyecto.ACTIVO })
  estado!: EstadoProyecto;

  @Column({ type: 'date', nullable: true })
  fechaLimite!: Date | null;

  @ManyToOne(() => Cliente, (cliente) => cliente.proyectos, { nullable: true })
  cliente!: Cliente | null;

  @OneToMany(() => Tarea, (tarea) => tarea.proyecto, { cascade: true })
  tareas!: Tarea[];

  @OneToMany(() => AsignacionProyecto, (asignacion) => asignacion.proyecto)
  asignaciones!: AsignacionProyecto[];
}
