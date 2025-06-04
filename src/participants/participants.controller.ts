import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  Query,
  Body,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { ParticipantsService } from './participants.service';
import {
  CreateParticipantDto,
  CreateParticipantSchema,
} from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';

@Controller('participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ZodValidationPipe(CreateParticipantSchema))
    createParticipantDto: CreateParticipantDto,
  ) {
    return this.participantsService.create(createParticipantDto);
  }

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const pageNum = page ? Number.parseInt(page, 10) : 1;
    const limitNum = limit ? Number.parseInt(limit, 10) : 10;

    return this.participantsService.findAll({
      page: pageNum,
      limit: limitNum,
      search,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.participantsService.findOne(id);
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string) {
    return this.participantsService.findByEmail(email);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    updateParticipantDto: UpdateParticipantDto,
  ) {
    return this.participantsService.update(id, updateParticipantDto);
  }

  @Post('confirm-payment')
  @HttpCode(HttpStatus.OK)
  async confirmPayment(confirmPaymentDto: ConfirmPaymentDto) {
    return this.participantsService.confirmPayment(confirmPaymentDto);
  }

  @Post(':id/generate-ticket')
  @HttpCode(HttpStatus.OK)
  async generateTicket(@Param('id') id: string) {
    return this.participantsService.generateTicket(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.participantsService.remove(id);
  }
}
