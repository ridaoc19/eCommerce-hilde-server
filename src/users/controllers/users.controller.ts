import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AccountUpdate, ChangeUserDto, RegistreUserDto, ResetUserDto } from '../dtos/users.dto';
import { Users } from '../entities/users.entity';
import { UsersService } from '../services/users.service';

export interface ResponseUser {
  statusCode: HttpStatus;
  message: string;
  data: Users;
}

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // ! REGISTRE
  @Post('registre')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: RegistreUserDto): Promise<Omit<ResponseUser, 'data'>> {
    const user = await this.usersService.create(payload);

    return {
      statusCode: HttpStatus.CREATED,
      message: `¡Registro exitoso! \n\n Hola ${user.name}, tu registro ha sido exitoso. Por favor, revisa tu cuenta de correo electrónico ${user.email} donde encontrarás una contraseña temporal que podrás utilizar para iniciar sesión. Una vez que hayas ingresado a tu cuenta, podrás cambiar la contraseña por una de tu preferencia.`,
    };
  }

  // ! CHANGE
  @Post('change')
  @HttpCode(HttpStatus.OK)
  async change(@Body() payload: ChangeUserDto): Promise<Omit<ResponseUser, 'data'>> {
    const user = await this.usersService.change(payload);
    return {
      statusCode: HttpStatus.OK,
      message: `¡Contraseña cambiada con éxito! \n\n ${user.name} a partir de ahora, puedes iniciar sesión en tu cuenta con la nueva contraseña.`,
    };
  }

  // ! RESET
  @Post('reset')
  @HttpCode(HttpStatus.OK)
  async reset(@Body() payload: ResetUserDto): Promise<Omit<ResponseUser, 'data'>> {
    const user = await this.usersService.reset(payload);
    return {
      statusCode: HttpStatus.OK,
      message: `¡Restablecimiento exitoso! \n\n ${user.name}, revisa tu bandeja de entrada de correo electrónico ${user.email}. Pronto recibirás una contraseña temporal.`,
    };
  }

  // ! ACCOUNT UPDATE
  @Post('account-update')
  @HttpCode(HttpStatus.OK)
  async accountUpdate(@Body() payload: AccountUpdate): Promise<ResponseUser> {
    const user = await this.usersService.accountUpdate(payload);
    return {
      statusCode: HttpStatus.OK,
      message: `¡Información actualizada con éxito! \n\n ${user.name}, tus datos han sido actualizados.`,
      data: user,
    };
  }
}
