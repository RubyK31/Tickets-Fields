import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TicketRepository } from './ticket.repository';
import { BaseRepository } from 'src/common/repository/base.repository';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [PrismaModule],
  providers: [TicketService, TicketRepository, BaseRepository, EmailService],
  controllers: [TicketController],
})
export class TicketModule {}
