import { Global, Module } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { Users } from 'src/users/entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
