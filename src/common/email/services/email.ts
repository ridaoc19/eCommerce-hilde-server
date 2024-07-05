import { Resend } from 'resend';
import { templateRegistre, TemplateRegistre } from './template';
import 'dotenv/config';

const resend = new Resend(process.env.KEY_RESEND || '');

export async function sendEmail(param: TemplateRegistre): Promise<boolean> {
  try {
    const { html, subject } = templateRegistre(param);

    false && console.log(resend);
    console.log({ param, html, subject });

    // const { error } = await resend.emails.send({
    //   from: process.env.EMAIL_RESEND || '',
    //   to: [param.email],
    //   subject,
    //   html,
    // });

    // if (error) {
    //   throw new Error('Error en el servidor de correos');
    // }

    return true;
  } catch (error) {
    throw new Error(error.message);
  }
}
