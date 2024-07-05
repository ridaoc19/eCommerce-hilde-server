import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dto';
import CategoryEntity from '../entities/category.entity';
import DepartmentEntity from '../entities/department.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(DepartmentEntity)
    private readonly departmentRepository: Repository<DepartmentEntity>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
    const { departmentId, ...categoryData } = createCategoryDto;
    const department = await this.departmentRepository.findOne({ where: { department_id: departmentId } });
    if (!department) {
      throw new NotFoundException(`Department with ID "${departmentId}" not found`);
    }
    const category = this.categoryRepository.create({ ...categoryData, department });
    return this.categoryRepository.save(category);
  }

  async findAll(): Promise<CategoryEntity[]> {
    return this.categoryRepository.find({ relations: ['department', 'subcategories'] });
  }

  async findOne(id: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: { category_id: id },
      relations: ['department', 'subcategories'],
    });
    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryEntity> {
    const { departmentId, ...categoryData } = updateCategoryDto;
    const department = departmentId
      ? await this.departmentRepository.findOne({ where: { department_id: departmentId } })
      : null;
    const category = await this.categoryRepository.preload({
      category_id: id,
      ...categoryData,
      department: department ?? undefined,
    });
    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
    return this.categoryRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.softRemove(category);
  }
}
