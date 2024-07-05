import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import CategoryEntity from './category.entity';

@Entity('department')
export default class DepartmentEntity {
  @PrimaryGeneratedColumn('uuid')
  department_id: string;

  @Column({ type: 'varchar' })
  department: string;

  @OneToMany(() => CategoryEntity, (category) => category.department, { cascade: ['soft-remove', 'recover'] })
  categories: CategoryEntity[];

  @DeleteDateColumn({ select: false })
  deletedAt: Date;
}
