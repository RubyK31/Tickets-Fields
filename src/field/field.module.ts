import { Module } from '@nestjs/common';
import { FieldService } from './field.service';
import { FieldController } from './field.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FieldRepository } from './field.repository';

@Module({
  imports: [PrismaModule],
  providers: [FieldService, FieldRepository],
  controllers: [FieldController],
})
export class FieldModule {}
