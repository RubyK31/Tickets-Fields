import { Module } from '@nestjs/common';
import { RoleService } from './roles.service';
import { RoleController } from './roles.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseRepository } from 'src/common/repository/base.repository';

@Module({
  controllers: [RoleController],
  providers: [RoleService, BaseRepository, PrismaService],
})
export class RolesModule {}
