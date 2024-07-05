import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ProductEntity from '../entities/product.entity';
import SubcategoryEntity from '../entities/subcategory.entity';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(SubcategoryEntity)
    private readonly subcategoryRepository: Repository<SubcategoryEntity>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductEntity> {
    const { subcategoryId, ...productData } = createProductDto;
    const subcategory = await this.subcategoryRepository.findOne({ where: { subcategory_id: subcategoryId } });
    if (!subcategory) {
      throw new NotFoundException(`Subcategory with ID "${subcategoryId}" not found`);
    }
    const product = this.productRepository.create({
      ...productData,
      subcategory,
    });
    return this.productRepository.save(product);
  }

  async findAll(): Promise<ProductEntity[]> {
    return this.productRepository.find({ relations: ['subcategory', 'variants'] });
  }

  async findOne(id: string): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { product_id: id },
      relations: ['subcategory', 'variants'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductEntity> {
    const { subcategoryId, ...productData } = updateProductDto;
    const subcategory = subcategoryId
      ? await this.subcategoryRepository.findOne({ where: { subcategory_id: subcategoryId } })
      : null;
    const product = await this.productRepository.preload({
      product_id: id,
      ...productData,
      subcategory: subcategory ?? undefined,
    });
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.softRemove(product);
  }
}
