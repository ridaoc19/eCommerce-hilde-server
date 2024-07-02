import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy } from 'passport-local';
import { Users } from 'src/users/entities/users.entity';
import { AuthService } from '../service/auth.service';

@Injectable()
export class LoginStrategy extends PassportStrategy(Strategy, 'login') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<Users> {
    try {
      const user = await this.authService.validateUser(email, password);
      return user;
    } catch (error) {
      throw error;
    }
  }
}
