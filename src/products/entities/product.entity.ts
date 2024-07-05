import { Users } from 'src/users/entities/users.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import SubcategoryEntity from './subcategory.entity';
import VariantEntity from './variant.entity';

@Entity('products')
export default class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  product_id: string;

  @Column({ type: 'varchar' })
  product: string;

  @Column()
  brand: string;

  @Column({ type: 'text' })
  description: string;

  @Column('varchar', { array: true })
  benefits: string[];

  @Column({ type: 'text' })
  contents: string;

  @Column({ type: 'text' })
  warranty: string;

  @Column({ type: 'jsonb' })
  specifications: Record<string, string>;

  @ManyToOne(() => SubcategoryEntity, (subcategory) => subcategory.products, { cascade: true })
  @JoinColumn({ name: 'subcategory_id' })
  subcategory: SubcategoryEntity;

  @OneToMany(() => VariantEntity, (variant) => variant.product, { cascade: ['soft-remove', 'recover'] })
  variants: VariantEntity[];

  @ManyToMany(() => Users, (user) => user.favorite)
  favorites: Users[];

  @DeleteDateColumn({ select: false })
  deletedAt: Date;
}
