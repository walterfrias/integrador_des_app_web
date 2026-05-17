import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AsignacionProyecto } from '../../gestion/entities/asignacion-proyecto.entity';
import { Tarea } from '../../gestion/entities/tarea.entity';

export enum RolUsuario {
  ADMIN = 'ADMIN',
  OPERADOR = 'OPERADOR',
}

export enum EstadoUsuario {
  ACTIVO = 'ACTIVO',
  BAJA = 'BAJA',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  nombre!: string;

  @Column({ type: 'varchar', nullable: true })
  apellido!: string | null;

  @Column({ type: 'varchar', unique: true, nullable: true })
  email!: string | null;

  @Column({ type: 'varchar', unique: true, nullable: true })
  cuil!: string | null;

  @Column({ select: false })
  clave!: string;

  @Column({ type: 'enum', enum: RolUsuario, default: RolUsuario.OPERADOR })
  rol!: RolUsuario;

  @Column({ type: 'enum', enum: EstadoUsuario, default: EstadoUsuario.ACTIVO })
  estado!: EstadoUsuario;

  @OneToMany(() => AsignacionProyecto, (asignacion) => asignacion.usuario)
  asignaciones!: AsignacionProyecto[];

  @OneToMany(() => Tarea, (tarea) => tarea.responsable)
  tareas!: Tarea[];
}
