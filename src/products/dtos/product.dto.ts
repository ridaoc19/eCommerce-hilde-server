import { PartialType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsObject, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'El nombre del producto debe ser una cadena de caracteres' })
  @IsNotEmpty({ message: 'El nombre del producto no puede estar vacío' })
  @MinLength(2, { message: 'El nombre del producto debe tener mínimo 2 caracteres' })
  @MaxLength(100, { message: 'El nombre del producto debe tener máximo 100 caracteres' })
  readonly product: string;

  @IsString({ message: 'La marca debe ser una cadena de caracteres' })
  @IsNotEmpty({ message: 'La marca no puede estar vacía' })
  readonly brand: string;

  @IsString({ message: 'La descripción debe ser una cadena de caracteres' })
  @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
  readonly description: string;

  @IsArray({ message: 'Los beneficios deben ser un arreglo' })
  @IsString({ each: true, message: 'Cada beneficio debe ser una cadena de caracteres' })
  readonly benefits: string[];

  @IsString({ message: 'El contenido debe ser una cadena de caracteres' })
  @IsNotEmpty({ message: 'El contenido no puede estar vacío' })
  readonly contents: string;

  @IsString({ message: 'La garantía debe ser una cadena de caracteres' })
  @IsNotEmpty({ message: 'La garantía no puede estar vacía' })
  readonly warranty: string;

  @IsObject({ message: 'Las especificaciones deben ser un objeto' })
  readonly specifications: Record<string, string>;

  @IsUUID('4', { message: 'El ID de la subcategoría debe ser un UUID válido' })
  readonly subcategoryId: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
