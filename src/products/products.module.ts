import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './controllers/category.controller';
import { DepartmentController } from './controllers/department.controller';
import { ProductController } from './controllers/product.controller';
import { SubcategoryController } from './controllers/subcategory.controller';
import { VariantController } from './controllers/variant.controller';
import CategoryEntity from './entities/category.entity';
import DepartmentEntity from './entities/department.entity';
import ProductEntity from './entities/product.entity';
import SubcategoryEntity from './entities/subcategory.entity';
import VariantEntity from './entities/variant.entity';
import { CategoryService } from './services/category.service';
import { DepartmentService } from './services/department.service';
import { ProductService } from './services/product.service';
import { SubcategoryService } from './services/subcategory.service';
import { VariantService } from './services/variant.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DepartmentEntity, CategoryEntity, SubcategoryEntity, ProductEntity, VariantEntity]),
  ],
  controllers: [DepartmentController, CategoryController, SubcategoryController, ProductController, VariantController],
  providers: [DepartmentService, CategoryService, SubcategoryService, ProductService, VariantService],
})
export class ProductModule {}
