import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import DepartmentEntity from './department.entity';
import SubcategoryEntity from './subcategory.entity';

@Entity('categories')
export default class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  category_id: string;

  @Column({ type: 'varchar' })
  category: string;

  @ManyToOne(() => DepartmentEntity, (department) => department.categories, { cascade: true })
  @JoinColumn({ name: 'department_id' })
  department: DepartmentEntity;

  @OneToMany(() => SubcategoryEntity, (subcategory) => subcategory.category, { cascade: ['soft-remove', 'recover'] })
  subcategories: SubcategoryEntity[];

  @DeleteDateColumn({ select: false })
  deletedAt: Date;
}
