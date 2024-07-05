import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';
import {
  AccountRoleDto,
  AccountSearchDto,
  AccountUpdateDto,
  ChangeUserDto,
  DeleteDto,
  RegistreUserDto,
  ResetUserDto,
  VerifyDto,
} from '../dtos/users.dto';
import { Users } from '../entities/users.entity';

import * as bcrypt from 'bcrypt';
import { generateHashPassword } from 'src/common/auth/bcryptUtils';
import { generateTokenEmail, verifyTokenEmail } from 'src/common/auth/jwtUtils';
import { AddCronJob, EmailService } from 'src/email/services/email.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    private configService: ConfigService,
    private emailServices: EmailService,
    private dataSource: DataSource,
    @InjectRepository(Users) private userRepo: Repository<Users>,
  ) {}

  findAll() {
    return this.userRepo.find();
  }

  findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  async findOne(user_id: string) {
    const user = await this.userRepo.findOne({
      where: { user_id },
    });
    if (!user) {
      throw new NotFoundException(`User #${user_id} not found`);
    }
    return user;
  }

  // ! REGISTRE
  async create(data: RegistreUserDto) {
    try {
      const temporaryPassword: string = uuidv4().split('-', 1)[0];
      const newUser = this.userRepo.create(data);

      const hashPassword = await bcrypt.hash(temporaryPassword, 10);
      newUser.password = hashPassword;
      const userCreate = await this.userRepo.save(newUser);

      this.emailServices.addCronJob({
        passwordTemporality: temporaryPassword,
        user_id: userCreate.user_id,
        type: AddCronJob.Registre,
        email: userCreate.email,
      });

      return userCreate;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`El correo electrónico ${data.email} ya se encuentra registrado`);
      }
      throw new NotFoundException('Error creando el usuario: ' + error.message);
    }
  }

  // ! CHANGE && ACCOUNT PASSWORD
  async change({ email, password, newPassword }: ChangeUserDto) {
    try {
      const user = await this.findByEmail(email);
      if (password !== newPassword) {
        throw new BadRequestException(
          `${user.name} las contraseñas no coinciden, por favor verificar y realizar el cambio nuevamente`,
        );
      }
      const hashPassword = await bcrypt.hash(password, 10);
      user.password = hashPassword;
      user.verified = true;
      const newUser = await this.userRepo.save(user);
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  // ! RESET
  async reset({ email }: ResetUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await queryRunner.manager.findOne(Users, {
        where: { email },
      });

      if (!user) {
        throw new BadRequestException(`El correo electrónico ${email} no se encuentra registrado`);
      }

      const temporaryPassword: string = uuidv4().split('-', 1)[0];
      const password = await generateHashPassword(temporaryPassword);
      user.password = password;
      user.verified = false;

      const newUser = await queryRunner.manager.save(user);

      await this.emailServices.addCronJob({
        passwordTemporality: temporaryPassword,
        user_id: newUser.user_id,
        type: AddCronJob.Reset,
        email: newUser.email,
      });

      await queryRunner.commitTransaction();
      return newUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // ! ACCOUNT UPDATE
  async accountUpdate({ user_id, email, lastName, name, phone, newEmail }: AccountUpdateDto) {
    try {
      let verifiedEmailUpdate: boolean = true;

      if (newEmail !== email) {
        verifiedEmailUpdate = false;
        const token = generateTokenEmail({ user_id, email: newEmail });
        this.emailServices.addCronJob({
          type: AddCronJob.ValidateEmail,
          tokenJWT: token,
          email: newEmail,
          user_id,
        });
      }

      const userUpdate = await this.findOne(user_id);
      userUpdate.name = name;
      userUpdate.lastName = lastName;
      userUpdate.phone = phone;
      userUpdate.verifiedEmail = verifiedEmailUpdate;
      await this.userRepo.save(userUpdate);

      return userUpdate;
    } catch (error) {
      throw error;
    }
  }

  // ! ACCOUNT SEARCH
  async accountSearch({ search }: AccountSearchDto) {
    try {
      const dataUserAll = await this.userRepo.find({
        where: [{ email: ILike(`%${search}%`) }, { name: ILike(`%${search}%`) }, { lastName: ILike(`%${search}%`) }],
        take: 10,
      });
      return dataUserAll;
    } catch (error) {
      throw error;
    }
  }

  // ! UPDATE ROLES
  async accountRoles({ user_id, role }: AccountRoleDto) {
    try {
      let previousRoles = '';
      const userUpdate = await this.userRepo.findOne({ where: { user_id } });
      if (!userUpdate) {
        throw new BadRequestException(`Usuario no existe`);
      }
      previousRoles = userUpdate.roles;
      userUpdate.roles = role;
      await this.userRepo.save(userUpdate);

      const users = await this.userRepo.find();

      return { users, user: userUpdate, previousRoles };
    } catch (error) {
      throw error;
    }
  }

  // ! VERIFY
  async verify({ token }: VerifyDto) {
    try {
      const decoded: { user_id: string; email: string; token?: boolean } = verifyTokenEmail(token);

      const userUpdate = await this.userRepo.findOne({ where: { user_id: decoded.user_id } });
      if (!userUpdate) {
        throw new BadRequestException(`Token invalido, solicita nuevamente el cambio de correo electrónico`);
      }
      userUpdate.email = decoded.email;
      userUpdate.verifiedEmail = true;
      await this.userRepo.save(userUpdate);

      return userUpdate;
    } catch (error) {
      throw error;
    }
  }

  // ! DELETE
  async remove({ user_id }: DeleteDto) {
    const user = await this.userRepo.findOne({ where: { user_id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${user_id} no encontrado.`);
    }

    await this.userRepo.delete(user_id);
    return user;
  }
}
