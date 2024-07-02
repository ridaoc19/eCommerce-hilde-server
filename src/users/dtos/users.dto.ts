import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegistreUserDto {
  @IsString({ message: 'El nombre debe ser una cadena de caracteres' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @MinLength(2, { message: 'El nombre debe tener mínimo 2 caracteres' })
  @MaxLength(20, { message: 'El nombre debe tener máximo 20 caracteres' })
  readonly name: string;

  @IsString({ message: 'El apellido debe ser una cadena de caracteres' })
  @IsNotEmpty({ message: 'El apellido no puede estar vacío' })
  @MinLength(2, { message: 'El apellido debe tener mínimo 2 caracteres' })
  @MaxLength(30, { message: 'El apellido debe tener máximo 30 caracteres' })
  readonly lastName: string;

  @IsString({
    message: 'El correo electrónico debe ser una cadena de caracteres',
  })
  @IsNotEmpty({ message: 'El correo electrónico no puede estar vacío' })
  @IsEmail({}, { message: 'El correo electrónico no tiene un formato válido' })
  readonly email: string;

  @IsNotEmpty({ message: 'El número de teléfono no puede estar vacío' })
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @IsNumber({}, { message: 'El número de teléfono debe ser un número' })
  readonly phone: number;
}

// export class ChangeUserDto extends PickType(CreateUserDto, ['email'] as const) {
export class ChangeUserDto {
  @IsEmail({}, { message: 'Inicia sesión nuevamente' })
  @IsNotEmpty({ message: 'Inicia sesión nuevamente' })
  @IsString({
    message: 'El correo electrónico debe ser una cadena de caracteres',
  })
  readonly email: string;

  @IsString({
    message: 'La nueva contraseña debe ser una cadena de caracteres',
  })
  @IsNotEmpty({ message: 'La nueva contraseña no puede estar vacía' })
  @MinLength(6, {
    message: 'La nueva contraseña debe tener mínimo 6 caracteres',
  })
  @MaxLength(15, {
    message: 'La nueva contraseña debe tener máximo 15 caracteres',
  })
  readonly password: string;

  @IsString({
    message:
      'La repetición de la nueva contraseña debe ser una cadena de caracteres',
  })
  @IsNotEmpty({
    message: 'La repetición de la nueva contraseña no puede estar vacía',
  })
  @MinLength(6, {
    message:
      'La repetición de la nueva contraseña debe tener mínimo 6 caracteres',
  })
  @MaxLength(15, {
    message:
      'La repetición de la nueva contraseña debe tener máximo 15 caracteres',
  })
  readonly newPassword: string;
}

export class ResetUserDto {
  @IsString({
    message: 'El correo electrónico debe ser una cadena de caracteres',
  })
  @IsNotEmpty({ message: 'El correo electrónico no puede estar vacío' })
  @IsEmail({}, { message: 'El correo electrónico no tiene un formato válido' })
  readonly email: string;
}
