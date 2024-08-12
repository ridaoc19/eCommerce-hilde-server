import { BadRequestException } from '@nestjs/common';
import { OmitType, PickType } from '@nestjs/swagger';
import { Row } from 'exceljs';
import { CreateCategoryDto } from './category.dto';
import { CreateDepartmentDto } from './department.dto';
import { CreateProductDto } from './product.dto';
import { CreateSubcategoryDto } from './subcategory.dto';
import { CreateVariantDto } from './variant.dto';

export class NavigationCreateDepartmentDto extends PickType(CreateDepartmentDto, ['department'] as const) {}
export class NavigationCreateCategoryDto extends OmitType(CreateCategoryDto, ['departmentId'] as const) {}
export class NavigationCreateSubcategoryDto extends OmitType(CreateSubcategoryDto, ['categoryId'] as const) {}
export class NavigationCreateProductDto extends OmitType(CreateProductDto, ['subcategoryId'] as const) {}
export class NavigationCreateVariantDto extends OmitType(CreateVariantDto, ['productId'] as const) {}

export type NavigationProductsDto = NavigationCreateDepartmentDto &
  NavigationCreateCategoryDto &
  NavigationCreateSubcategoryDto &
  NavigationCreateProductDto &
  NavigationCreateVariantDto;

export const expectedKeys: (keyof NavigationProductsDto)[] = [
  'department',
  'category',
  'subcategory',
  'product',
  'brand',
  'description',
  'benefits',
  'contents',
  'warranty',
  'specifications',
  'images',
  'videos',
  'attributes',
  'price',
  'listPrice',
  'stock',
] satisfies (keyof NavigationProductsDto)[];

export const title = ({ row }: { row: Row }) => {
  const rowTitle = [];
  row.eachCell((cell, colNumber) => {
    const value = cell.value as string;
    rowTitle[colNumber] = value.charAt(0).toLowerCase() + value.slice(1);
  });
  // Validar los títulos
  const missingKeys = expectedKeys.filter((key) => !rowTitle.includes(key));
  const extraKeys = rowTitle.filter((key) => !expectedKeys.includes(key));

  if (missingKeys.length > 0) {
    throw new BadRequestException(`Verificar los nombres de columnas, faltarían estos: ${missingKeys.join(', ')}`);
  }
  if (extraKeys.length > 0) {
    throw new BadRequestException(`Verificar los nombres de columnas, estas sobran: ${extraKeys.join(', ')}`);
  }
  return rowTitle;
};
