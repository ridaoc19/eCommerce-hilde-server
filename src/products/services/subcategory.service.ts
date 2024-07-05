import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSubcategoryDto, UpdateSubcategoryDto } from '../dtos/subcategory.dto';
import CategoryEntity from '../entities/category.entity';
import SubcategoryEntity from '../entities/subcategory.entity';

@Injectable()
export class SubcategoryService {
  constructor(
    @InjectRepository(SubcategoryEntity)
    private readonly subcategoryRepository: Repository<SubcategoryEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(createSubcategoryDto: CreateSubcategoryDto): Promise<SubcategoryEntity> {
    const { categoryId, ...subcategoryData } = createSubcategoryDto;
    const category = await this.categoryRepository.findOne({ where: { category_id: categoryId } });
    if (!category) {
      throw new NotFoundException(`Category with ID "${categoryId}" not found`);
    }
    const subcategory = this.subcategoryRepository.create({ ...subcategoryData, category });
    return this.subcategoryRepository.save(subcategory);
  }

  async findAll(): Promise<SubcategoryEntity[]> {
    return this.subcategoryRepository.find({ relations: ['category', 'products'] });
  }

  async findOne(id: string): Promise<SubcategoryEntity> {
    const subcategory = await this.subcategoryRepository.findOne({
      where: { subcategory_id: id },
      relations: ['category', 'products'],
    });
    if (!subcategory) {
      throw new NotFoundException(`Subcategory with ID "${id}" not found`);
    }
    return subcategory;
  }

  async update(id: string, updateSubcategoryDto: UpdateSubcategoryDto): Promise<SubcategoryEntity> {
    const { categoryId, ...subcategoryData } = updateSubcategoryDto;
    const category = categoryId ? await this.categoryRepository.findOne({ where: { category_id: categoryId } }) : null;
    const subcategory = await this.subcategoryRepository.preload({
      subcategory_id: id,
      ...subcategoryData,
      category: category ?? undefined,
    });
    if (!subcategory) {
      throw new NotFoundException(`Subcategory with ID "${id}" not found`);
    }
    return this.subcategoryRepository.save(subcategory);
  }

  async remove(id: string): Promise<void> {
    const subcategory = await this.findOne(id);
    await this.subcategoryRepository.softRemove(subcategory);
  }
}
