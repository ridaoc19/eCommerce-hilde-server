import { Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { generateTokenJWT, PayloadToken } from 'src/common/auth/jwtUtils';
import { Users } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/services/users.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LoginAuthGuard } from '../guards/login-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private usersService: UsersService) {}

  // ! LOGIN
  @UseGuards(LoginAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Req() req: Request) {
    const user = generateTokenJWT({
      user: req.user as Users,
      expiresIn: '1d',
    });
    return {
      statusCode: HttpStatus.OK,
      message: !user.verified
        ? `${user.name} debes cambiar la contraseña por una de tú preferencia`
        : !user.verifiedEmail
          ? `${user.name} verifica el buzón de correo, y valida el correo electrónico, si no desea cambiarlo, en 10 minutos seguirá registrado con el correo ${user.email}`
          : `¡Inicio de sesión exitoso! \n\n ${user?.name},Te damos la bienvenida de vuelta a nuestro sitio web.`,
      data: user,
    };
  }

  // ! TOKEN
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get('token')
  async token(@Req() req: Request) {
    const token = req.user as PayloadToken;
    const user = await this.usersService.findOne(token.user_id);
    return {
      statusCode: HttpStatus.OK,
      message: `¡Bienvenido de vuelta, ${user.name}! Te has conectado exitosamente utilizando un token de sesión.`,
      data: user,
    };
  }
}
