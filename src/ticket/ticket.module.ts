import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TicketRepository } from './ticket.repository';

@Module({
  imports: [PrismaModule],
  providers: [TicketService, TicketRepository],
  controllers: [TicketController],
})
export class TicketModule {}
