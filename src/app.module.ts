import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ParticipantsModule } from './participants/participants.module';
import { EmailModule } from './email/email.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    ParticipantsModule,
    EmailModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
