import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateDepartmentDto {
  @IsString({ message: 'El nombre del departamento debe ser una cadena de caracteres' })
  @IsNotEmpty({ message: 'El nombre del departamento no puede estar vacío' })
  @MinLength(2, { message: 'El nombre del departamento debe tener mínimo 2 caracteres' })
  @MaxLength(50, { message: 'El nombre del departamento debe tener máximo 50 caracteres' })
  readonly department: string;
}

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {}
