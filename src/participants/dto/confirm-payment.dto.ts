import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const ConfirmPaymentSchema = z.object({
  participantId: z.string().cuid('ID de participante inválido'),
});

export class ConfirmPaymentDto extends createZodDto(ConfirmPaymentSchema) {}
