import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDepartmentDto, UpdateDepartmentDto } from '../dtos/department.dto';
import DepartmentEntity from '../entities/department.entity';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(DepartmentEntity)
    private readonly departmentRepository: Repository<DepartmentEntity>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto): Promise<DepartmentEntity> {
    const department = this.departmentRepository.create(createDepartmentDto);
    return this.departmentRepository.save(department);
  }

  async findAll(): Promise<DepartmentEntity[]> {
    return this.departmentRepository.find({ relations: ['categories'] });
  }

  async findOne(id: string): Promise<DepartmentEntity> {
    const department = await this.departmentRepository.findOne({
      where: { department_id: id },
      relations: { categories: true },
    });
    // const department = await this.departmentRepository.findOne(id, { relations: ['categories'] });
    if (!department) {
      throw new NotFoundException(`Department with ID "${id}" not found`);
    }
    return department;
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<DepartmentEntity> {
    const department = await this.departmentRepository.preload({
      department_id: id,
      ...updateDepartmentDto,
    });
    if (!department) {
      throw new NotFoundException(`Department with ID "${id}" not found`);
    }
    return this.departmentRepository.save(department);
  }

  async remove(id: string): Promise<void> {
    const department = await this.findOne(id);
    await this.departmentRepository.softRemove(department);
  }
}
