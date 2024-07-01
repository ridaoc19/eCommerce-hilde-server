import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from 'src/common/auth/bcryptUtils';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException(
        `Lo sentimos, el usuario (${email}) no está registrado. Por favor, verifique que ha ingresado correctamente sus credenciales o regístrese para crear una nueva cuenta.`,
      );
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException(
        `Lo sentimos, la contraseña no es válida.`,
      );
    }
    if (user && isMatch) {
      return user;
    }
    return null;
  }
}
