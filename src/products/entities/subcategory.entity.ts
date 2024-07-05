import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import CategoryEntity from './category.entity';
import ProductEntity from './product.entity';

@Entity('subcategories')
export default class SubcategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  subcategory_id: string;

  @Column({ type: 'varchar' })
  subcategory: string;

  @ManyToOne(() => CategoryEntity, (category) => category.subcategories, { cascade: true })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @OneToMany(() => ProductEntity, (product) => product.subcategory, { cascade: ['soft-remove', 'recover'] })
  products: ProductEntity[];

  @DeleteDateColumn({ select: false })
  deletedAt: Date;
}
