import { Module } from '@nestjs/common';
import { FieldService } from './field.service';
import { FieldController } from './field.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FieldRepository } from './field.repository';
import { BaseRepository } from 'src/common/base.repository';

@Module({
  imports: [PrismaModule],
  providers: [FieldService, FieldRepository, BaseRepository],
  controllers: [FieldController],
})
export class FieldModule {}
