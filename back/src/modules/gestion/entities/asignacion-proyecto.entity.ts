import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Usuario } from '../../auth/entities/usuario.entity';
import { Proyecto } from './proyecto.entity';
import { EstadoAsignacion } from '../enums/estados-asignacion.enum';

@Entity('asignaciones_proyecto')
export class AsignacionProyecto {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Usuario, { nullable: false })
  usuario!: Usuario;

  @ManyToOne(() => Proyecto, (proyecto) => proyecto.asignaciones, { nullable: false, onDelete: 'CASCADE' })
  proyecto!: Proyecto;

  @Column({ type: 'enum', enum: EstadoAsignacion, default: EstadoAsignacion.ACTIVO })
  estado!: EstadoAsignacion;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  fechaAsignacion!: Date;
}
