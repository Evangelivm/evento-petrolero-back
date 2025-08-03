import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateParticipantSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefono: z
    .number()
    .int('El teléfono debe ser un número entero')
    .positive('El teléfono debe ser positivo')
    .refine(
      (val) => val.toString().length >= 9 && val.toString().length <= 15,
      {
        message: 'El teléfono debe tener entre 9 y 15 dígitos',
      },
    ),
  ruc: z.string().optional(),
  tipo_participante: z.enum([
    'EMPRESAS',
    'INSTITUCIONES',
    'PROFESIONALES',
    'ESTUDIANTES',
    'PUBLICO_EN_GENERAL',
    'AUSPICIADOR',
    'AUTORIDAD',
    'MEDIA_PARTNER',
    'ALUMNO_UNIVERSITARIO',
  ]),
  comprobante: z.string().nullable().optional(),
  metodo_pago: z.enum(['YAPE', 'PLIN', 'TRANSFERENCIA', 'EFECTIVO']),
  dias: z.string().optional(),
  monto: z.number().positive('El monto debe ser positivo').nullable(),
  estado_pago: z.enum(['PENDIENTE', 'CONFIRMADO']).optional(),
  codigo: z.string().min(1, 'El código es requerido'), // <-- agregado
});

export class CreateParticipantDto extends createZodDto(
  CreateParticipantSchema,
) {}
