import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'El nombre de la categoría debe ser una cadena de caracteres' })
  @IsNotEmpty({ message: 'El nombre de la categoría no puede estar vacío' })
  @MinLength(2, { message: 'El nombre de la categoría debe tener mínimo 2 caracteres' })
  @MaxLength(50, { message: 'El nombre de la categoría debe tener máximo 50 caracteres' })
  readonly category: string;

  @IsUUID('4', { message: 'El ID del departamento debe ser un UUID válido' })
  readonly departmentId: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
