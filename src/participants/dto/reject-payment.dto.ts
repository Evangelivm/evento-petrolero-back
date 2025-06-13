import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const RejectPaymentSchema = z.object({
  participantId: z.string().cuid('ID de participante inválido'),
});

export class RejectPaymentDto extends createZodDto(RejectPaymentSchema) {}
