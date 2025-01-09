import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersRepository } from './users.repository';
import { BaseRepository } from 'src/common/base.repository';

@Module({
  imports: [PrismaModule],
  providers: [UsersService, PrismaService, UsersRepository, BaseRepository],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
