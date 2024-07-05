import * as jwt from 'jsonwebtoken';
import { Users } from 'src/users/entities/users.entity';

export interface PayloadToken {
  user_id: string;
  email: string;
}

type GenerateTokenJWT = (data: { user: Users; expiresIn: string }) => Users & { access_token: string };

export const generateTokenJWT: GenerateTokenJWT = ({ user, expiresIn }) => {
  try {
    const assignToken: PayloadToken = {
      user_id: user.user_id,
      email: user.email,
    };

    if (!process.env.SECRET_KEY_JWT) {
      throw new Error('Secret key for JWT is not defined');
    }

    const access_token = jwt.sign(assignToken, process.env.SECRET_KEY_JWT, { expiresIn });
    return Object.assign(user, { access_token });
  } catch (error) {
    throw new Error('Error generating JWT token');
  }
};

export function verifyTokenJWT(token: string): any {
  try {
    if (!process.env.SECRET_KEY_JWT) {
      throw new Error('Secret key for JWT is not defined');
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
    return decoded;
  } catch (error) {
    return { token: true, error: 'Invalid token' };
  }
}

export function generateTokenEmail(payload: { user_id: string; email: string }): string {
  try {
    if (!process.env.SECRET_KEY_JWT_EMAIL) {
      throw new Error('Secret key for JWT email is not defined');
    }

    // Generar el token con el payload y la clave secreta
    return jwt.sign(payload, process.env.SECRET_KEY_JWT_EMAIL, { expiresIn: '10m' });
  } catch (error) {
    throw new Error('Error generating email JWT token');
  }
}

export function verifyTokenEmail(token: string): any {
  try {
    if (!process.env.SECRET_KEY_JWT_EMAIL) {
      throw new Error('Secret key for JWT email is not defined');
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT_EMAIL);
    return decoded;
  } catch (error) {
    return { token: true, error: 'Invalid token' };
  }
}
