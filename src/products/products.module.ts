import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './controllers/category.controller';
import { DepartmentController } from './controllers/department.controller';
import { ProductController } from './controllers/product.controller';
import { SubcategoryController } from './controllers/subcategory.controller';
import { VariantController } from './controllers/variant.controller copy';
import CategoryEntity from './entities/category.entity';
import DepartmentEntity from './entities/department.entity';
import ProductEntity from './entities/product.entity';
import SubcategoryEntity from './entities/subcategory.entity';
import VariantEntity from './entities/variant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DepartmentEntity, CategoryEntity, SubcategoryEntity, ProductEntity, VariantEntity]),
  ],
  controllers: [DepartmentController, CategoryController, SubcategoryController, ProductController, VariantController],
  providers: [DepartmentController, CategoryController, SubcategoryController, ProductController, VariantController],
})
export class ProductModule {}
