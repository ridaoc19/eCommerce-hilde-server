import { BadRequestException, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { LoginDto } from '../dtos/auth.dto';

@Injectable()
export class LoginAuthGuard extends AuthGuard('login') {
  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { body } = request;

    // Validar el DTO
    const loginDto = plainToClass(LoginDto, body);
    const validationErrors = await validate(loginDto);
    if (validationErrors.length > 0) {
      const errorMessages = validationErrors.flatMap((error) => Object.values(error.constraints));
      throw new BadRequestException(errorMessages);
    }

    return super.canActivate(context) as Promise<boolean>;
  }

  handleRequest(err, user) {
    if (err) {
      throw err;
    }
    return user;
  }
}
