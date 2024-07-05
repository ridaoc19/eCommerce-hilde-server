import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import ProductEntity from './product.entity';

@Entity('variants')
export default class VariantEntity {
  @PrimaryGeneratedColumn('uuid')
  variant_id: string;

  @Column('varchar', { array: true })
  images: string[];

  @Column({ type: 'jsonb' })
  attributes: Record<string, string>;

  @Column('varchar', { array: true })
  videos: string[];

  @Column('float')
  price: number;

  @Column('float')
  listPrice: number;

  @Column('int')
  stock: number;

  @ManyToOne(() => ProductEntity, (product) => product.variants, { cascade: true })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  // @ManyToMany(() => CartEntity, (cart) => cart.variant)
  // cart: CartEntity[];

  @DeleteDateColumn({ select: false })
  deletedAt: Date;
}
