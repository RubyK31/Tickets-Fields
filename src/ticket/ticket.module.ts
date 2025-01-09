import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TicketRepository } from './ticket.repository';
import { BaseRepository } from 'src/common/base.repository';

@Module({
  imports: [PrismaModule],
  providers: [TicketService, TicketRepository, BaseRepository],
  controllers: [TicketController],
})
export class TicketModule {}
