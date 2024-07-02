import { Users } from 'src/users/entities/users.entity';

export enum TypeTemplateRegistre {
  Registre_0 = 'registre_0',
  Registre_1 = 'registre_1',
  Registre_2 = 'registre_2',
  Reset_0 = 'reset_0',
  Reset_1 = 'reset_1',
  Reset_2 = 'reset_2',
  ValidateEmail_0 = 'validateEmail_0',
  ValidateEmail_1 = 'validateEmail_1',
  ValidateEmail_2 = 'validateEmail_2',
}

export type TemplateRegistre = Pick<Users, 'name' | 'email' | 'password'> & {
  tokenJWT: string;
  type: TypeTemplateRegistre;
};

function assertUnreachable(x: never): never {
  throw new Error(`No se agrego ${x} a los template de correos electrónicos`);
}

export const templateRegistre = ({
  name,
  password,
  type,
  tokenJWT,
}: TemplateRegistre): { subject: string; html: string } => {
  switch (type) {
    case TypeTemplateRegistre.Registre_0:
      return {
        subject: 'Verificación de correo electrónico',
        html: `<html>

                  <head>
                      <style>
                          body {
                              font-family: Arial, sans-serif;
                              background-color: #f5f5f5;
                          }

                          .container {
                              max-width: 600px;
                              margin: 0 auto;
                              border-radius: 10px;
                              text-align: center;
                              border: 1px solid #ffa5513b;
                          }

                          .content {
                              background-color: white;
                              border-top-left-radius: 11px;
                              border-top-right-radius: 11px;
                          }

                          .content .header {
                              background-color: #fff2e791;
                              border-top-left-radius: 11px;
                              border-top-right-radius: 11px;
                          }

                          .content .header img {
                              width: 100px;
                              display: block;
                              margin: 0 auto;
                              padding: 20px;
                              color: white;
                          }

                          .content .main {
                              padding: 0 20px 10px;
                          }

                          h1,
                          h2,
                          h3,
                          h4,
                          h6 {
                              color: #333;
                              text-align: center;
                          }

                          .pass {
                              text-align: center;
                          }

                          .pass h2 {
                              margin: 0 auto;
                              padding: 10px;
                              background-color: #FFA451;
                              width: min-content;
                              border-radius: 5px;
                          }

                          p {
                              color: #555;
                              line-height: 1.5;
                              text-align: justify;
                          }

                          .container>p {
                              text-align: center;
                          }

                          h6 {
                              color: #DB2424;
                          }
                      </style>
                  </head>

                  <body>
                      <div class="container">
                          <div class="content">
                              <div class="header">
                                  <img src="${process.env.URL_CLIENT}/favicon.ico" alt="">
                              </div>
                              <div class="main">
                                  <h1>Verificación de correo electrónico</h1>
                                  <p>${name} gracias por iniciar el proceso de creación de la nueva cuenta. Queremos asegurarnos de
                                      que es realmente usted. Inicie sesión con la contraseña temporal. Si no desea
                                      crear una cuenta, puede omitir este mensaje.</p>
                                  <h3>Contraseña temporal</h3>
                                  <div class="pass">
                                      <h2>${password}</h2>
                                  </div>
                                  <h6>(Esta contraseña es válida durante 10 minutos)</h6>
                                  <hr>
                                  <p>Nunca se enviará un correo electrónico o se solicitará que revele o verifique su contraseña
                                      personal, tarjeta de crédito o número de cuenta bancaria.</p>
                              </div>
                          </div>
                          <p>Calle 30. Anorí, Antioquia, Colombia. © 2023, e-commerce.
                              Todos los derechos reservados. <a href="${process.env.URL_CLIENT}/hilde">E-commerce Hilde.</a>
                          </p>
                      </div>
                  </body>

                  </html>`,
      };

    case TypeTemplateRegistre.Registre_1:
      return {
        subject: 'Recordatorio para activar tu cuenta',
        html: `<html>

              <head>
                  <style>
                      body {
                          font-family: Arial, sans-serif;
                          background-color: #f5f5f5;
                      }

                      .container {
                          max-width: 600px;
                          margin: 0 auto;
                          border-radius: 10px;
                          text-align: center;
                          border: 1px solid #ffa5513b;
                      }

                      .content {
                          background-color: white;
                          border-top-left-radius: 11px;
                          border-top-right-radius: 11px;
                      }

                      .content .header {
                          background-color: #fff2e791;
                          border-top-left-radius: 11px;
                          border-top-right-radius: 11px;
                      }

                      .content .header img {
                          width: 100px;
                          display: block;
                          margin: 0 auto;
                          padding: 20px;
                          color: white;
                      }

                      .content .main {
                          padding: 0 20px 10px;
                      }

                      h1,
                      h2,
                      h3,
                      h4,
                      h6 {
                          color: #333;
                          text-align: center;
                      }

                      p, li {
                          color: #555;
                          line-height: 1.5;
                          text-align: justify;
                      }

                      .container>p {
                          text-align: center;
                      }
                  </style>
              </head>

              <body>
                  <div class="container">
                      <div class="content">
                          <div class="header">
                              <img src="${process.env.URL_CLIENT}/favicon.ico" alt="">
                          </div>
                          <div class="main">
                              <h1>Tu registro está próximo a vencer</h1>
                              <p>${name}, te recordamos que tu registro en nuestro sitio web está próximo a vencer. Para evitar
                                  que tu cuenta sea eliminada, te recomendamos realizar los siguientes pasos:</p>
                              <ol>
                                  <li>Inicia sesión utilizando la contraseña temporal que te enviamos en el correo anterior.</li>
                                  <li>Sigue las instrucciones para cambiar la contraseña por una personal y segura.</li>
                              </ol>
                              <p>Si no completas estos pasos en los próximos 5 minutos, tu registro será eliminado y deberás crear
                                  nuevamente tu cuenta.</p>
                              <hr>
                              <p>Queremos asegurarte que nunca enviaremos un correo electrónico solicitando que reveles o
                                  verifiques tu contraseña personal, tarjeta de crédito o número de cuenta bancaria. Mantenemos la
                                  seguridad de tus datos como nuestra máxima prioridad.</p>
                          </div>
                      </div>
                      <p>Calle 30. Anorí, Antioquia, Colombia. © 2023, e-commerce.
                          Todos los derechos reservados. <a href="${process.env.URL_CLIENT}/hilde">E-commerce Hilde.</a>
                      </p>
                  </div>
              </body>

              </html>`,
      };

    case TypeTemplateRegistre.Registre_2:
      return {
        subject: 'Notificación de eliminación de cuenta',
        html: ` <html>

              <head>
                  <style>
                      body {
                          font-family: Arial, sans-serif;
                          background-color: #f5f5f5;
                      }

                      .container {
                          max-width: 600px;
                          margin: 0 auto;
                          border-radius: 10px;
                          text-align: center;
                          border: 1px solid #ffa5513b;
                      }

                      .content {
                          background-color: white;
                          border-top-left-radius: 11px;
                          border-top-right-radius: 11px;
                      }

                      .content .header {
                          background-color: #fff2e791;
                          border-top-left-radius: 11px;
                          border-top-right-radius: 11px;
                      }

                      .content .header img {
                          width: 100px;
                          display: block;
                          margin: 0 auto;
                          padding: 20px;
                          color: white;
                      }

                      .content .main {
                          padding: 0 20px 10px;
                      }

                      h1,
                      h2,
                      h3,
                      h4,
                      h6 {
                          color: #333;
                          text-align: center;
                      }

                      p,
                      li {
                          color: #555;
                          line-height: 1.5;
                          text-align: justify;
                      }

                      .container>p {
                          text-align: center;
                      }
                  </style>
              </head>

              <body>
                  <div class="container">
                      <div class="content">
                          <div class="header">
                              <img src="${process.env.URL_CLIENT}/favicon.ico" alt="">
                          </div>
                          <div class="main">
                              <h1>Tu registro ha vencido</h1>
                              <p>${name}, lamentamos informarte que tu registro ha vencido. Para poder utilizar nuestro sitio web,
                                  deberás crear nuevamente una cuenta siguiendo estos pasos:</p>
                              <ol>
                                  <li>Ingresa al siguiente enlace para crear una nueva cuenta: <a
                                          href="${process.env.URL_CLIENT}/registre">Crear cuenta</a></li>
                                  <li>Una vez creada la cuenta, asegúrate de activarla dentro de un lapso de 10 minutos para
                                      evitar que sea eliminada.</li>
                              </ol>

                              <hr>
                              <p>Queremos asegurarte que nunca enviaremos un correo electrónico solicitando que reveles o
                                  verifiques tu contraseña personal, tarjeta de crédito o número de cuenta bancaria. Mantenemos la
                                  seguridad de tus datos como nuestra máxima prioridad.</p>
                          </div>
                      </div>
                      <p>Calle 30. Anorí, Antioquia, Colombia. © 2023, e-commerce.
                          Todos los derechos reservados. <a href="${process.env.URL_CLIENT}/hilde">E-commerce Hilde.</a>
                      </p>
                  </div>
              </body>

              </html>`,
      };

    case TypeTemplateRegistre.Reset_0:
      return {
        subject: 'Restablecimiento de contraseña',
        html: `<html>

                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f5f5f5;
                            }

                            .container {
                                max-width: 600px;
                                margin: 0 auto;
                                border-radius: 10px;
                                text-align: center;
                                border: 1px solid #ffa5513b;
                            }

                            .content {
                                background-color: white;
                                border-top-left-radius: 11px;
                                border-top-right-radius: 11px;
                            }

                            .content .header {
                                background-color: #fff2e791;
                                border-top-left-radius: 11px;
                                border-top-right-radius: 11px;
                            }

                            .content .header img {
                                width: 100px;
                                display: block;
                                margin: 0 auto;
                                padding: 20px;
                                color: white;
                            }

                            .content .main {
                                padding: 0 20px 10px;
                            }

                            h1,
                            h2,
                            h3,
                            h4,
                            h6 {
                                color: #333;
                                text-align: center;
                            }

                            .pass {
                                text-align: center;
                            }

                            .pass h2 {
                                margin: 0 auto;
                                padding: 10px;
                                background-color: #FFA451;
                                width: min-content;
                                border-radius: 5px;
                            }

                            p {
                                color: #555;
                                line-height: 1.5;
                                text-align: justify;
                            }

                            .container>p {
                                text-align: center;
                            }

                            h6 {
                                color: #DB2424;
                            }
                        </style>
                    </head>

                    <body>
                        <div class="container">
                            <div class="content">
                                <div class="header">
                                    <img src="${process.env.URL_CLIENT}/favicon.ico" alt="">
                                </div>
                                <div class="main">
                                    <h1>Tu contraseña cambió</h1>
                                    <p>${name} gracias por solicitar el restablecimiento de contraseña. Queremos asegurarnos de
                                        que es realmente usted. Inicie sesión con la contraseña temporal que encontraras a continuación
                                        y te pedirá que cambie la contraseña por una personal.</p>
                                    <h3>Contraseña temporal</h3>
                                    <div class="pass">
                                        <h2>${password}</h2>
                                    </div>
                                    <h6>(Esta contraseña es válida durante 10 minutos)</h6>
                                    <hr>
                                    <p>Haz clic <a href="${process.env.URL_CLIENT}/login">aca</a> y te llevara a Iniciar
                                        sesión</p>
                                    <p>Nunca se enviará un correo electrónico o se solicitará que revele o verifique su contraseña
                                        personal, tarjeta de crédito o número de cuenta bancaria.</p>
                                </div>
                            </div>
                            <p>Calle 30. Anorí, Antioquia, Colombia. © 2023, e-commerce.
                                Todos los derechos reservados. <a href="${process.env.URL_CLIENT}/hilde">E-commerce Hilde.</a>
                            </p>
                        </div>
                    </body>

                    </html>`,
      };

    case TypeTemplateRegistre.Reset_1:
      return {
        subject: 'Recordatorio para restablecer contraseña',
        html: `<html>

              <head>
                  <style>
                      body {
                          font-family: Arial, sans-serif;
                          background-color: #f5f5f5;
                      }

                      .container {
                          max-width: 600px;
                          margin: 0 auto;
                          border-radius: 10px;
                          text-align: center;
                          border: 1px solid #ffa5513b;
                      }

                      .content {
                          background-color: white;
                          border-top-left-radius: 11px;
                          border-top-right-radius: 11px;
                      }

                      .content .header {
                          background-color: #fff2e791;
                          border-top-left-radius: 11px;
                          border-top-right-radius: 11px;
                      }

                      .content .header img {
                          width: 100px;
                          display: block;
                          margin: 0 auto;
                          padding: 20px;
                          color: white;
                      }

                      .content .main {
                          padding: 0 20px 10px;
                      }

                      h1,
                      h2,
                      h3,
                      h4,
                      h6 {
                          color: #333;
                          text-align: center;
                      }

                      p, li {
                          color: #555;
                          line-height: 1.5;
                          text-align: justify;
                      }

                      .container>p {
                          text-align: center;
                      }
                  </style>
              </head>

              <body>
                  <div class="container">
                      <div class="content">
                          <div class="header">
                              <img src="${process.env.URL_CLIENT}/favicon.ico" alt="">
                          </div>
                          <div class="main">
                          <h1>Tu restablecimiento de contraseña está próximo a vencer</h1>
                          <p>${name}, te recordamos que tu cambio de contraseña está próximo a vencer. para evitar que la contraseña
                          venza, te recomendamos realizar los siguientes pasos:</p>
                          <ol>
                              <li>Inicia sesión utilizando la contraseña temporal que te enviamos en el correo anterior.</li>
                              <li>Sigue las instrucciones para cambiar la contraseña por una personal y segura.</li>
                          </ol>
                          <p>Si no completas estos pasos en los próximos 5 minutos, tu contraseña se vencerá y deberá restablecerla nuevamente.</p>
                              <hr>
                              <p>Queremos asegurarte que nunca enviaremos un correo electrónico solicitando que reveles o
                                  verifiques tu contraseña personal, tarjeta de crédito o número de cuenta bancaria. Mantenemos la
                                  seguridad de tus datos como nuestra máxima prioridad.</p>
                          </div>
                      </div>
                      <p>Calle 30. Anorí, Antioquia, Colombia. © 2023, e-commerce.
                          Todos los derechos reservados. <a href="${process.env.URL_CLIENT}/hilde">E-commerce Hilde.</a>
                      </p>
                  </div>
              </body>

              </html>`,
      };

    case TypeTemplateRegistre.Reset_2:
      return {
        subject: 'El tiempo para restablecer la contraseña ha vencido',
        html: `<html>

              <head>
                  <style>
                      body {
                          font-family: Arial, sans-serif;
                          background-color: #f5f5f5;
                      }

                      .container {
                          max-width: 600px;
                          margin: 0 auto;
                          border-radius: 10px;
                          text-align: center;
                          border: 1px solid #ffa5513b;
                      }

                      .content {
                          background-color: white;
                          border-top-left-radius: 11px;
                          border-top-right-radius: 11px;
                      }

                      .content .header {
                          background-color: #fff2e791;
                          border-top-left-radius: 11px;
                          border-top-right-radius: 11px;
                      }

                      .content .header img {
                          width: 100px;
                          display: block;
                          margin: 0 auto;
                          padding: 20px;
                          color: white;
                      }

                      .content .main {
                          padding: 0 20px 10px;
                      }

                      h1,
                      h2,
                      h3,
                      h4,
                      h6 {
                          color: #333;
                          text-align: center;
                      }

                      p, li {
                          color: #555;
                          line-height: 1.5;
                          text-align: justify;
                      }

                      .container>p {
                          text-align: center;
                      }
                  </style>
              </head>

              <body>
                  <div class="container">
                      <div class="content">
                          <div class="header">
                              <img src="${process.env.URL_CLIENT}/favicon.ico" alt="">
                          </div>
                          <div class="main">
                          <h1>El tiempo para restablecer la contraseña ha vencido</h1>
                          <p>${name}, te informamos que el período para restablecer tu contraseña ha vencido. Si aún necesitas cambiar tu contraseña, deberás volver a solicitar el restablecimiento siguiendo estos pasos:</p>
                          <ol>
                          <li>Haz clic <a href="${process.env.URL_CLIENT}/reset">aquí</a> para solicitar nuevamente el restablecimiento de contraseña.</li>
                          <li>Ingresa tu correo electrónico y recibirás una contraseña temporal en tu bandeja de entrada.</li>
                          <li>Tienes 10 minutos para cambiar la contraseña temporal por una personal y segura.</li>
                          </ol>
                              <hr>
                              <p>Queremos asegurarte que nunca enviaremos un correo electrónico solicitando que reveles o
                                  verifiques tu contraseña personal, tarjeta de crédito o número de cuenta bancaria. Mantenemos la
                                  seguridad de tus datos como nuestra máxima prioridad.</p>
                          </div>
                      </div>
                      <p>Calle 30. Anorí, Antioquia, Colombia. © 2023, e-commerce.
                          Todos los derechos reservados. <a href="${process.env.URL_CLIENT}/hilde">E-commerce Hilde.</a>
                      </p>
                  </div>
              </body>

              </html>`,
      };

    case TypeTemplateRegistre.ValidateEmail_0:
      return {
        subject: 'Verificación de correo electrónico',
        html: `<html>

                  <head>
                      <style>
                          body {
                              font-family: Arial, sans-serif;
                              background-color: #f5f5f5;
                          }

                          .container {
                              max-width: 600px;
                              margin: 0 auto;
                              border-radius: 10px;
                              text-align: center;
                              border: 1px solid #ffa5513b;
                          }

                          .content {
                              background-color: white;
                              border-top-left-radius: 11px;
                              border-top-right-radius: 11px;
                          }

                          .content .header {
                              background-color: #fff2e791;
                              border-top-left-radius: 11px;
                              border-top-right-radius: 11px;
                          }

                          .content .header img {
                              width: 100px;
                              display: block;
                              margin: 0 auto;
                              padding: 20px;
                              color: white;
                          }

                          .content .main {
                              padding: 0 20px 10px;
                          }

                          h1,
                          h2,
                          h3,
                          h4,
                          h6 {
                              color: #333;
                              text-align: center;
                          }

                          .pass {
                              text-align: center;
                          }

                          .pass h2 {
                              margin: 0 auto;
                              padding: 10px;
                              background-color: #FFA451;
                              width: min-content;
                              border-radius: 5px;
                          }

                          p {
                              color: #555;
                              line-height: 1.5;
                              text-align: justify;
                          }

                          .container>p {
                              text-align: center;
                          }

                          h6 {
                              color: #DB2424;
                          }
                      </style>
                  </head>

                  <body>
                      <div class="container">
                          <div class="content">
                              <div class="header">
                                  <img src="${process.env.URL_CLIENT}/favicon.ico" alt="">
                              </div>
                              <div class="main">
                                  <h1>Verificación de correo electrónico</h1>
                                  <p>${name}, para verificar su cuenta, haga clic en el siguiente enlace:</p>
                                  <a href="${process.env.URL_CLIENT}/verify/${tokenJWT}">Verificar mi cuenta</a>
                                  <p>Si no desea cambiar el correo electrónico, puede omitir este mensaje.</p>
                                  <p><em>Nota: Este enlace de verificación es válido durante 10 minutos, a partir de este tiempo se omitirá el cambio de correo electrónico.</em></p>
                                  <hr>
                                  <p>Nunca se enviará un correo electrónico o se solicitará que revele o verifique su contraseña personal, tarjeta de crédito o número de cuenta bancaria.</p>
                                  </div>
                          </div>
                          <p>Calle 30. Anorí, Antioquia, Colombia. © 2023, e-commerce.
                              Todos los derechos reservados. <a href="${process.env.URL_CLIENT}/hilde">E-commerce Hilde.</a>
                          </p>
                      </div>
                  </body>

                  </html>`,
      };

    case TypeTemplateRegistre.ValidateEmail_1:
      return {
        subject: 'Recordatorio cambio de Correo Electrónico',
        html: `<html>

                      <head>
                          <style>
                              body {
                                  font-family: Arial, sans-serif;
                                  background-color: #f5f5f5;
                              }

                              .container {
                                  max-width: 600px;
                                  margin: 0 auto;
                                  border-radius: 10px;
                                  text-align: center;
                                  border: 1px solid #ffa5513b;
                              }

                              .content {
                                  background-color: white;
                                  border-top-left-radius: 11px;
                                  border-top-right-radius: 11px;
                              }

                              .content .header {
                                  background-color: #fff2e791;
                                  border-top-left-radius: 11px;
                                  border-top-right-radius: 11px;
                              }

                              .content .header img {
                                  width: 100px;
                                  display: block;
                                  margin: 0 auto;
                                  padding: 20px;
                                  color: white;
                              }

                              .content .main {
                                  padding: 0 20px 10px;
                              }

                              h1,
                              h2,
                              h3,
                              h4,
                              h6 {
                                  color: #333;
                                  text-align: center;
                              }

                              p, li {
                                  color: #555;
                                  line-height: 1.5;
                                  text-align: justify;
                              }

                              .container>p {
                                  text-align: center;
                              }
                          </style>
                      </head>

                      <body>
                          <div class="container">
                              <div class="content">
                                  <div class="header">
                                      <img src="${process.env.URL_CLIENT}/favicon.ico" alt="">
                                  </div>
                                  <div class="main">
                                      <h1>Tu cambio de correo electrónico esta próximo a vencer</h1>
                                      <p>${name}, te recordamos que tu de correo electrónico está próximo a vencer. Para evitar
                                          que se venza la solicitud, te recomendamos realizar la validación en el enlace que se envió en un correo anterior:</p>
                                      <p>Si no completas estos pasos en los próximos 5 minutos, se cancelara el cambio de correo electrónico.</p>
                                      <hr>
                                      <p>Queremos asegurarte que nunca enviaremos un correo electrónico solicitando que reveles o
                                          verifiques tu contraseña personal, tarjeta de crédito o número de cuenta bancaria. Mantenemos la
                                          seguridad de tus datos como nuestra máxima prioridad.</p>
                                  </div>
                              </div>
                              <p>Calle 30. Anorí, Antioquia, Colombia. © 2023, e-commerce.
                                  Todos los derechos reservados. <a href="${process.env.URL_CLIENT}/hilde">E-commerce Hilde.</a>
                              </p>
                          </div>
                      </body>

                      </html>`,
      };

    case TypeTemplateRegistre.ValidateEmail_2:
      return {
        subject: 'Notificación de cambio Correo Electrónico',
        html: ` <html>

                      <head>
                          <style>
                              body {
                                  font-family: Arial, sans-serif;
                                  background-color: #f5f5f5;
                              }

                              .container {
                                  max-width: 600px;
                                  margin: 0 auto;
                                  border-radius: 10px;
                                  text-align: center;
                                  border: 1px solid #ffa5513b;
                              }

                              .content {
                                  background-color: white;
                                  border-top-left-radius: 11px;
                                  border-top-right-radius: 11px;
                              }

                              .content .header {
                                  background-color: #fff2e791;
                                  border-top-left-radius: 11px;
                                  border-top-right-radius: 11px;
                              }

                              .content .header img {
                                  width: 100px;
                                  display: block;
                                  margin: 0 auto;
                                  padding: 20px;
                                  color: white;
                              }

                              .content .main {
                                  padding: 0 20px 10px;
                              }

                              h1,
                              h2,
                              h3,
                              h4,
                              h6 {
                                  color: #333;
                                  text-align: center;
                              }

                              p,
                              li {
                                  color: #555;
                                  line-height: 1.5;
                                  text-align: justify;
                              }

                              .container>p {
                                  text-align: center;
                              }
                          </style>
                      </head>

                      <body>
                          <div class="container">
                              <div class="content">
                                  <div class="header">
                                      <img src="${process.env.URL_CLIENT}/favicon.ico" alt="">
                                  </div>
                                  <div class="main">
                                      <h1>Tu cambio de correo electrónico ha vencido</h1>
                                      <p>${name}, lamentamos informarte que tu cambio de correo electrónico ha vencido. Puedes
                                      volver a solicitar el cambio de correo electrónico</p>
                                      <hr>
                                      <p>Queremos asegurarte que nunca enviaremos un correo electrónico solicitando que reveles o
                                          verifiques tu contraseña personal, tarjeta de crédito o número de cuenta bancaria. Mantenemos la
                                          seguridad de tus datos como nuestra máxima prioridad.</p>
                                  </div>
                              </div>
                              <p>Calle 30. Anorí, Antioquia, Colombia. © 2023, e-commerce.
                                  Todos los derechos reservados. <a href="${process.env.URL_CLIENT}/hilde">E-commerce Hilde.</a>
                              </p>
                          </div>
                      </body>

                      </html>`,
      };
    default:
      assertUnreachable(type);
  }
};
