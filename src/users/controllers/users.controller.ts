import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { ChangeUserDto, RegistreUserDto } from '../dtos/users.dto';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // ! REGISTRE
  @Post('registre')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: RegistreUserDto) {
    try {
      const response = await this.usersService.create(payload);

      return {
        statusCode: HttpStatus.CREATED,
        message: `${payload.name} su cuenta fue registrada correctamente con su correo electrónico ${payload.email}`,
        data: response,
      };
    } catch (error) {
      console.log(error.code, error.message);
      if (error.code === '23505') {
        throw new ConflictException([
          `El correo electrónico ${payload.email} ya se encuentra registrado`,
        ]);
      }
      throw new InternalServerErrorException(['Error interno del servidor']);
    }
  }

  // ! CHANGE
  @Post('change')
  @HttpCode(HttpStatus.OK)
  async change(@Body() payload: ChangeUserDto) {
    const user = await this.usersService.change(payload);
    if (user) {
      return {
        statusCode: HttpStatus.OK,
        message: `¡Contraseña cambiada con éxito! \n\n ${user.name} a partir de ahora, puedes iniciar sesión en tu cuenta con la nueva contraseña.`,
      };
    } else {
      throw new BadRequestException(
        'Se presento un error al actualizar la contraseña, por favor inténtelo de nuevo o contactar con la tienda',
      );
    }
  }

  // ! RESET
  @Post('reset')
  @HttpCode(HttpStatus.OK)
  async reset(@Body() payload) {
    const user = await this.usersService.reset(payload);

    if (user) {
      return {
        statusCode: HttpStatus.OK,
        message: `¡Restablecimiento exitoso! \n\n ${user.name}, revisa tu bandeja de entrada de correo electrónico ${user.email}. Pronto recibirás una contraseña temporal.`,
      };
    } else {
      throw new BadRequestException(
        'Se presento un error al actualizar la contraseña, por favor inténtelo de nuevo o contactar con la tienda',
      );
    }
  }
}
