import { Injectable, NotFoundException } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CronJob } from 'cron';
import { Users } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { sendEmail } from './email';
import { TypeTemplateRegistre } from './template';

export enum AddCronJob {
  Registre = 'registre',
  Reset = 'reset',
  ValidateEmail = 'validateEmail',
}

export type AddCronJobMap = {
  [AddCronJob.Registre]: {
    type: AddCronJob.Registre;
    passwordTemporality: string;
    email: string;
  };
  [AddCronJob.Reset]: {
    type: AddCronJob.Reset;
    email: string;
    passwordTemporality: string;
  };
  [AddCronJob.ValidateEmail]: {
    type: AddCronJob.ValidateEmail;
    tokenJWT: string;
    email: string;
  };
};

@Injectable()
export class EmailService {
  private jobExecutionCounts: Record<string, number> = {};
  constructor(
    @InjectRepository(Users) private userRepo: Repository<Users>,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  //!
  async addCronJob<T extends AddCronJob>(data: AddCronJobMap[T]) {
    const { email, type } = data;
    const capitalizedNewName = capitalizeFirstLetter(type);
    this.jobExecutionCounts[type] = 0;

    try {
      //TODO TAREA
      const job = new CronJob('*/2 * * * *', async () => {
        try {
          this.jobExecutionCounts[type]++;
          const countName = this.jobExecutionCounts[type];
          const totalTypeTemplate = Object.values(TypeTemplateRegistre).filter(
            (e) => e.includes(type),
          ).length;

          const user = await this.userRepo.findOne({ where: { email } });

          if (
            (type === AddCronJob.Registre && user.verified) ||
            (type === AddCronJob.ValidateEmail && user.verifiedEmail) ||
            (type === AddCronJob.Reset && user.verified)
          ) {
            delete this.jobExecutionCounts[type];
            this.schedulerRegistry.deleteCronJob(type);
            return;
          }

          // ? EMAIL
          await sendEmail({
            email: user.email,
            name: user.name,
            tokenJWT:
              data.type === AddCronJob.ValidateEmail ? data.tokenJWT : '',
            password:
              data.type !== AddCronJob.ValidateEmail
                ? data.passwordTemporality
                : '',
            type: TypeTemplateRegistre[
              `${capitalizedNewName}_${this.jobExecutionCounts[type]}`
            ],
          });

          // * si no realizan validaciones cancela y si es reset elimina
          if (countName === totalTypeTemplate - 1) {
            if (type === 'registre') {
              await this.userRepo.remove(user);
            }
            delete this.jobExecutionCounts[type];
            this.schedulerRegistry.deleteCronJob(type);
            return;
          }
        } catch (error) {
          delete this.jobExecutionCounts[type];
          this.schedulerRegistry.deleteCronJob(type);
          throw new NotFoundException(error.message);
        }
      });

      //TODO TERMINA TAREA

      // TODO AGREGA LA TAREA
      this.schedulerRegistry.addCronJob(type, job);
      job.start();

      const user = await this.userRepo.findOne({ where: { email } });

      // ? EMAIL
      await sendEmail({
        email: user.email,
        name: user.name,
        tokenJWT: data.type === AddCronJob.ValidateEmail ? data.tokenJWT : '',
        password:
          data.type !== AddCronJob.ValidateEmail
            ? data.passwordTemporality
            : '',
        type: TypeTemplateRegistre[
          `${capitalizedNewName}_${this.jobExecutionCounts[type]}`
        ],
      });
    } catch (error) {
      delete this.jobExecutionCounts[type];
      this.schedulerRegistry.deleteCronJob(type);
      throw new NotFoundException(error.message);
    }
  }
}

function capitalizeFirstLetter(string: string): string {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
}
