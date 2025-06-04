// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import * as nodemailer from 'nodemailer';
// import { Participant } from '@prisma/client';

// @Injectable()
// export class EmailService {
//   private transporter: nodemailer.Transporter;

//   constructor(private configService: ConfigService) {
//     this.transporter = nodemailer.createTransport({
//       host: this.configService.get('SMTP_HOST'),
//       port: this.configService.get('SMTP_PORT'),
//       secure: false,
//       auth: {
//         user: this.configService.get('SMTP_USER'),
//         pass: this.configService.get('SMTP_PASS'),
//       },
//     });
//   }

//   async sendRegistrationConfirmation(participant: Participant) {
//     const mailOptions = {
//       from: this.configService.get('FROM_EMAIL'),
//       to: participant.email,
//       subject: 'Confirmación de Registro - Reactiva Petrol 2025',
//       html: this.getRegistrationTemplate(participant),
//     };

//     try {
//       await this.transporter.sendMail(mailOptions);
//       console.log(`Email de confirmación enviado a: ${participant.email}`);
//     } catch (error) {
//       console.error('Error enviando email de confirmación:', error);
//     }
//   }

//   async sendPaymentConfirmation(participant: Participant) {
//     const mailOptions = {
//       from: this.configService.get('FROM_EMAIL'),
//       to: participant.email,
//       subject: 'Pago Confirmado - Reactiva Petrol 2025',
//       html: this.getPaymentConfirmationTemplate(participant),
//     };

//     try {
//       await this.transporter.sendMail(mailOptions);
//       console.log(`Email de pago confirmado enviado a: ${participant.email}`);
//     } catch (error) {
//       console.error('Error enviando email de pago confirmado:', error);
//     }
//   }

//   private getRegistrationTemplate(participant: Participant): string {
//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="utf-8">
//         <title>Confirmación de Registro</title>
//       </head>
//       <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
//         <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
//           <h1 style="color: #2563eb;">¡Registro Exitoso!</h1>

//           <p>Estimado/a ${participant.firstName} ${participant.lastName},</p>

//           <p>Su registro para <strong>Reactiva Petrol 2025</strong> ha sido recibido exitosamente.</p>

//           <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
//             <h3>Detalles de su registro:</h3>
//             <p><strong>Número de Ticket:</strong> ${participant.ticketNumber}</p>
//             <p><strong>Tipo de Ticket:</strong> ${participant.ticketType}</p>
//             <p><strong>Monto:</strong> S/ ${participant.paymentAmount}</p>
//             <p><strong>Estado del Pago:</strong> ${participant.paymentStatus}</p>
//           </div>

//           <p><strong>Próximos pasos:</strong></p>
//           <ol>
//             <li>Realice el pago según el método seleccionado</li>
//             <li>Envíe el comprobante de pago</li>
//             <li>Espere la confirmación de su pago</li>
//             <li>Recibirá su código QR de acceso</li>
//           </ol>

//           <p>¡Gracias por su participación!</p>

//           <hr style="margin: 30px 0;">
//           <p style="font-size: 12px; color: #666;">
//             Este es un email automático, por favor no responda a este mensaje.
//           </p>
//         </div>
//       </body>
//       </html>
//     `;
//   }

//   private getPaymentConfirmationTemplate(participant: Participant): string {
//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="utf-8">
//         <title>Pago Confirmado</title>
//       </head>
//       <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
//         <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
//           <h1 style="color: #059669;">¡Pago Confirmado!</h1>

//           <p>Estimado/a ${participant.firstName} ${participant.lastName},</p>

//           <p>Su pago para <strong>Reactiva Petrol 2025</strong> ha sido confirmado exitosamente.</p>

//           <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
//             <h3>INFORMACIÓN IMPORTANTE:</h3>
//             <ul>
//               <li>Recibirá un código QR vía email después de la validación del pago</li>
//               <li>Deberá presentar el código QR para el acceso el día del evento</li>
//             </ul>
//           </div>

//           <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
//             <h3>Detalles de su ticket:</h3>
//             <p><strong>Número de Ticket:</strong> ${participant.ticketNumber}</p>
//             <p><strong>Referencia de Pago:</strong> ${participant.paymentReference}</p>
//             <p><strong>Fecha de Pago:</strong> ${participant.paymentDate?.toLocaleDateString()}</p>
//           </div>

//           ${
//             participant.qrCode
//               ? `
//             <div style="text-align: center; margin: 30px 0;">
//               <h3>Su Código QR de Acceso:</h3>
//               <img src="${participant.qrCode}" alt="QR Code" style="max-width: 200px;">
//               <p style="font-size: 12px; color: #666;">
//                 Presente este código QR el día del evento
//               </p>
//             </div>
//           `
//               : ''
//           }

//           <p>¡Nos vemos en el evento!</p>

//           <hr style="margin: 30px 0;">
//           <p style="font-size: 12px; color: #666;">
//             Este es un email automático, por favor no responda a este mensaje.
//           </p>
//         </div>
//       </body>
//       </html>
//     `;
//   }
// }
