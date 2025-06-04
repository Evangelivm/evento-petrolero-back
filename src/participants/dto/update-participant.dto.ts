import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CreateParticipantSchema } from './create-participant.dto';

export const UpdateParticipantSchema = CreateParticipantSchema.partial().extend(
  {
    estado_pago: z.enum(['PENDIENTE', 'CONFIRMADO', 'RECHAZADO']).optional(),
    fecha_pago: z.date().optional(),
    fecha_validacion: z.date().optional(),
    fecha_actualizacion: z.date().optional(),
    codigo_qr: z.string().optional(),
    codigo: z.string().optional(),
  },
);

export class UpdateParticipantDto extends createZodDto(
  UpdateParticipantSchema,
) {}
