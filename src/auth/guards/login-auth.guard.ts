import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LoginAuthGuard extends AuthGuard('login') {
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext) {
    try {
      return super.canActivate(context);
    } catch (error) {
      throw new UnauthorizedException(['Fallo inicio de sesión formato email']);
    }
  }

  handleRequest(err, user, info) {
    try {
      if (err || !user || info) {
        if (err.response.error === 'Unauthorized') {
          throw new UnauthorizedException([
            'Correo electrónico o contraseña incorrectos',
          ]);
        }
        throw new UnauthorizedException(['Fallo inicio de sesión']);
      }

      return user;
    } catch (err) {
      if (err.response.error === 'Unauthorized') {
        throw new UnauthorizedException([
          'Correo electrónico o contraseña incorrectos',
        ]);
      }
      throw new UnauthorizedException(['Fallo inicio de sesión']);
    }
  }
}
