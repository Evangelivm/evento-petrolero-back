import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const UpdateCorreoEnviadoSchema = z.object({
  participantId: z.string().cuid('ID de participante inválido'),
});

export class UpdateCorreoEnviadoDto extends createZodDto(
  UpdateCorreoEnviadoSchema,
) {}
