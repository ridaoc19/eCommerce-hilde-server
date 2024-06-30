import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'El nombre debe ser una cadena de caracteres' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @MinLength(2, { message: 'El nombre debe tener mínimo 2 caracteres' })
  @MaxLength(20, { message: 'El nombre debe tener máximo 20 caracteres' })
  @ApiProperty({
    description: 'El nombre del usuario',
    minLength: 2,
    maxLength: 20,
    example: 'Juan',
  })
  readonly name: string;

  @IsString({ message: 'El apellido debe ser una cadena de caracteres' })
  @IsNotEmpty({ message: 'El apellido no puede estar vacío' })
  @MinLength(2, { message: 'El apellido debe tener mínimo 2 caracteres' })
  @MaxLength(30, { message: 'El apellido debe tener máximo 30 caracteres' })
  @ApiProperty({
    description: 'El apellido del usuario',
    minLength: 2,
    maxLength: 30,
    example: 'Pérez Martinez',
  })
  readonly lastName: string;

  @IsString({
    message: 'El correo electrónico debe ser una cadena de caracteres',
  })
  @IsNotEmpty({ message: 'El correo electrónico no puede estar vacío' })
  @IsEmail({}, { message: 'El correo electrónico no tiene un formato válido' })
  @ApiProperty({
    description: 'El correo electrónico del usuario',
    example: 'juan.perez@example.com',
  })
  readonly email: string;

  @IsNotEmpty({ message: 'El número de teléfono no puede estar vacío' })
  @ApiProperty({
    description: 'El número de teléfono del usuario',
    example: '123456789',
  })
  readonly phone: number;
}
