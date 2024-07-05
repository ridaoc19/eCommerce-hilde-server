import { PartialType } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsArray, IsNumber, IsString, IsOptional, IsObject, ArrayMinSize } from 'class-validator';

export class CreateVariantDto {
  @IsUUID('4', { message: 'El ID del producto debe ser un UUID válido' })
  readonly productId: string;

  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsNotEmpty({ message: 'El precio no puede estar vacío' })
  readonly price: number;

  @IsNumber({}, { message: 'El precio de lista debe ser un número' })
  @IsNotEmpty({ message: 'El precio de lista no puede estar vacío' })
  readonly listPrice: number;

  @IsNumber({}, { message: 'El stock debe ser un número' })
  @IsNotEmpty({ message: 'El stock no puede estar vacío' })
  readonly stock: number;

  @IsArray({ message: 'Las imágenes deben ser un arreglo' })
  @ArrayMinSize(1, { message: 'Debe haber al menos una imagen' })
  @IsString({ each: true, message: 'Cada imagen debe ser una cadena de caracteres' })
  readonly images: string[];

  @IsArray({ message: 'Los videos deben ser un arreglo' })
  @IsString({ each: true, message: 'Cada video debe ser una cadena de caracteres' })
  @IsOptional()
  readonly videos: string[];

  @IsNotEmpty({ message: 'Los atributos no pueden estar vacíos' })
  @IsObject({ message: 'Los atributos deben ser un objeto' })
  readonly attributes: Record<string, string>;
}

export class UpdateVariantDto extends PartialType(CreateVariantDto) {}
