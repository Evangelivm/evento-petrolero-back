import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const ConfirmPaymentSchema = z.object({
  participantId: z.string().cuid('ID de participante inválido'),
  paymentReference: z.string().min(1, 'La referencia de pago es requerida'),
});

export class ConfirmPaymentDto extends createZodDto(ConfirmPaymentSchema) {}
