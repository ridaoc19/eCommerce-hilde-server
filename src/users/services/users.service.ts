import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ChangeUserDto, RegistreUserDto } from '../dtos/users.dto';
import { Users } from '../entities/users.entity';

import * as bcrypt from 'bcrypt';
import { generateHashPassword } from 'src/common/auth/bcryptUtils';
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
        type: AddCronJob.Registre,
        passwordTemporality: temporaryPassword,
        email: userCreate.email,
      });

      return userCreate;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  // ! CHANGE
  async change({ email, password }: ChangeUserDto) {
    const user = await this.findByEmail(email);
    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;
    user.verified = true;
    const newUser = await this.userRepo.save(user);
    return newUser;
  }

  // ! RESET
  async reset({ email }) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await queryRunner.manager.findOne(Users, {
        where: { email },
      });

      const temporaryPassword: string = uuidv4().split('-', 1)[0];
      const password = await generateHashPassword(temporaryPassword);
      user.password = password;
      user.verified = false;

      const newUser = await queryRunner.manager.save(user);

      await this.emailServices.addCronJob({
        type: AddCronJob.Reset,
        email: newUser.email,
        passwordTemporality: temporaryPassword,
      });

      await queryRunner.commitTransaction();
      return newUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new NotFoundException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  // ! DELETE
  remove(user_id: number) {
    return this.userRepo.delete(user_id);
  }
}
