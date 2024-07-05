import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateSubcategoryDto {
  @IsString({ message: 'El nombre de la subcategoría debe ser una cadena de caracteres' })
  @IsNotEmpty({ message: 'El nombre de la subcategoría no puede estar vacío' })
  @MinLength(2, { message: 'El nombre de la subcategoría debe tener mínimo 2 caracteres' })
  @MaxLength(50, { message: 'El nombre de la subcategoría debe tener máximo 50 caracteres' })
  readonly subcategory: string;

  @IsUUID('4', { message: 'El ID de la categoría debe ser un UUID válido' })
  readonly categoryId: string;
}

export class UpdateSubcategoryDto extends PartialType(CreateSubcategoryDto) {}
