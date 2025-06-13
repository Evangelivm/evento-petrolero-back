import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// import { EmailService } from '../email/email.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import * as QRCode from 'qrcode';
import { participantes_estado_pago } from '@prisma/client';
import { RejectPaymentDto } from './dto/reject-payment.dto';
import { UpdateCorreoEnviadoDto } from './dto/update-correo-enviado.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ParticipantsService {
  constructor(
    private prisma: PrismaService,
    // private emailService: EmailService,
  ) {}

  async create(createParticipantDto: CreateParticipantDto) {
    // Check if email already exists
    const existingParticipant = await this.prisma.participantes.findFirst({
      where: { email: createParticipantDto.email },
    });

    if (existingParticipant) {
      throw new ConflictException('Ya existe un participante con este email');
    }

    // Create participant
    const data: Prisma.participantesUncheckedCreateInput = {
      nombre: createParticipantDto.nombre,
      email: createParticipantDto.email,
      telefono: createParticipantDto.telefono,
      ruc: createParticipantDto.ruc,
      tipo_participante: createParticipantDto.tipo_participante,
      dias: createParticipantDto.dias ?? '',
      metodo_pago: createParticipantDto.metodo_pago,
      comprobante: createParticipantDto.comprobante,
      monto: createParticipantDto.monto,
      codigo: createParticipantDto.codigo,
      estado_pago: createParticipantDto.estado_pago ?? undefined, // <-- agregado
      correo_enviado: 'NO',
    };

    const participant = await this.prisma.participantes.create({
      data,
    });

    // Send confirmation email
    // await this.emailService.sendRegistrationConfirmation(participant);

    return {
      message: 'Participante registrado exitosamente',
      participant: {
        id: participant.id,
        email: participant.email,
        codigo: participant.codigo,
        estado_pago: participant.estado_pago,
      },
    };
  }

  async findAll(options: { page: number; limit: number; search?: string }) {
    const { page, limit, search } = options;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { nombre: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
            { ruc: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [participants, total] = await Promise.all([
      this.prisma.participantes.findMany({
        where,
        skip,
        take: limit,
        orderBy: { fecha_creacion: 'desc' },
      }),
      this.prisma.participantes.count({ where }),
    ]);

    return {
      participants,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const participant = await this.prisma.participantes.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!participant) {
      throw new NotFoundException('Participante no encontrado');
    }

    return participant;
  }

  async findByEmail(email: string) {
    const participant = await this.prisma.participantes.findFirst({
      where: { email },
    });

    if (!participant) {
      throw new NotFoundException('Participante no encontrado');
    }

    return participant;
  }

  async update(id: string, updateParticipantDto: UpdateParticipantDto) {
    const participant = await this.findOne(id);

    const updatedParticipant = await this.prisma.participantes.update({
      where: { id: parseInt(id, 10) },
      data: updateParticipantDto,
    });

    return {
      message: 'Participante actualizado exitosamente',
      participant: updatedParticipant,
    };
  }

  async confirmPayment(confirmPaymentDto: ConfirmPaymentDto) {
    const { participantId } = confirmPaymentDto;

    const participant = await this.findOne(participantId);

    if (participant.estado_pago === 'CONFIRMADO') {
      throw new BadRequestException('El pago ya ha sido confirmado');
    }

    // Update participant
    const updatedParticipant = await this.prisma.participantes.update({
      where: { id: parseInt(participantId, 10) },
      data: {
        estado_pago: participantes_estado_pago.CONFIRMADO,
        fecha_pago: new Date(),
        fecha_validacion: new Date(),
      },
    });

    return {
      message: 'Pago confirmado exitosamente',
      participant: updatedParticipant,
    };
  }

  async rejectPayment(rejectPaymentDto: RejectPaymentDto) {
    const { participantId } = rejectPaymentDto;

    const participant = await this.findOne(participantId);

    if (participant.estado_pago === 'RECHAZADO') {
      throw new BadRequestException('El pago ya ha sido rechazado');
    }

    const updatedParticipant = await this.prisma.participantes.update({
      where: { id: parseInt(participantId, 10) },
      data: {
        estado_pago: participantes_estado_pago.RECHAZADO,
        fecha_pago: new Date(),
        fecha_validacion: new Date(),
      },
    });

    return {
      message: 'Pago rechazado exitosamente',
      participant: updatedParticipant,
    };
  }

  async updateCorreoEnviado(updateCorreoEnviadoDto: UpdateCorreoEnviadoDto) {
    const { participantId } = updateCorreoEnviadoDto;

    const participant = await this.findOne(participantId);

    // if (participant.correo_enviado === 'SI') {
    //   throw new BadRequestException('El correo ya ha sido enviado');
    // }

    const updatedParticipant = await this.prisma.participantes.update({
      where: { id: parseInt(participantId, 10) },
      data: {
        correo_enviado: 'SI',
        fecha_actualizacion: new Date(),
      },
    });

    return {
      message: 'Correo enviado actualizado exitosamente',
      participant: updatedParticipant,
    };
  }

  async generateTicket(id: string) {
    const participant = await this.findOne(id);

    if (participant.estado_pago !== 'CONFIRMADO') {
      throw new BadRequestException(
        'El pago debe estar confirmado para generar el ticket',
      );
    }

    // if (!participant.codigo_qr) {
    //   throw new BadRequestException(
    //     'No se puede generar el ticket sin código QR',
    //   );
    // }

    return {
      message: 'Ticket generado exitosamente',
      ticket: {
        participantId: participant.id,
        codigo: participant.codigo,
        participantName: participant.nombre,
        email: participant.email,
      },
    };
  }

  async remove(id: string) {
    const participant = await this.findOne(id);

    await this.prisma.participantes.delete({
      where: { id: parseInt(id, 10) },
    });

    return {
      message: 'Participante eliminado exitosamente',
    };
  }

  // private async generateTicketNumber(): Promise<string> {
  //   const count = await this.prisma.participantes.count();
  //   const ticketNumber = `RP2025-${(count + 1).toString().padStart(4, '0')}`;
  //   return ticketNumber;
  // }
}
