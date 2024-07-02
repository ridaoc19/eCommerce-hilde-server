import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

// ! LOGIN
export class LoginDto {
  @IsString({
    message: 'El correo electrónico debe ser una cadena de caracteres',
  })
  @IsNotEmpty({ message: 'El correo electrónico no puede estar vacío' })
  @IsEmail({}, { message: 'El correo electrónico no tiene un formato válido' })
  readonly email: string;

  @IsString({ message: 'La contraseña debe ser una cadena de caracteres' })
  @IsNotEmpty({ message: 'La contraseña no puede estar vacío' })
  @MinLength(2, { message: 'La contraseña debe tener mínimo 2 caracteres' })
  @MaxLength(20, { message: 'La contraseña debe tener máximo 20 caracteres' })
  readonly password: string;
}
