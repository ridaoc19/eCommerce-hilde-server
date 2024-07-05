import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVariantDto, UpdateVariantDto } from '../dtos/variant.dto';
import ProductEntity from '../entities/product.entity';
import VariantEntity from '../entities/variant.entity';

@Injectable()
export class VariantService {
  constructor(
    @InjectRepository(VariantEntity)
    private readonly variantRepository: Repository<VariantEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async create(createVariantDto: CreateVariantDto): Promise<VariantEntity> {
    const { productId, ...variantData } = createVariantDto;
    const product = await this.productRepository.findOne({ where: { product_id: productId } });
    if (!product) {
      throw new NotFoundException(`Product with ID "${productId}" not found`);
    }
    const variant = this.variantRepository.create({
      ...variantData,
      product,
    });
    return this.variantRepository.save(variant);
  }

  async findAll(): Promise<VariantEntity[]> {
    return this.variantRepository.find({ relations: ['product'] });
  }

  async findOne(id: string): Promise<VariantEntity> {
    const variant = await this.variantRepository.findOne({ where: { variant_id: id }, relations: ['product'] });
    if (!variant) {
      throw new NotFoundException(`Variant with ID "${id}" not found`);
    }
    return variant;
  }

  async update(id: string, updateVariantDto: UpdateVariantDto): Promise<VariantEntity> {
    const { productId, ...variantData } = updateVariantDto;
    const product = productId ? await this.productRepository.findOne({ where: { product_id: productId } }) : null;
    const variant = await this.variantRepository.preload({
      variant_id: id,
      ...variantData,
      product: product ?? undefined,
    });
    if (!variant) {
      throw new NotFoundException(`Variant with ID "${id}" not found`);
    }
    return this.variantRepository.save(variant);
  }

  async remove(id: string): Promise<void> {
    const variant = await this.findOne(id);
    await this.variantRepository.softRemove(variant);
  }
}
