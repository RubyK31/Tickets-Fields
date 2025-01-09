import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TicketModule } from './ticket/ticket.module';
import { FieldModule } from './field/field.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SwaggerSetupService } from './swagger-setup.service';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    TicketModule,
    FieldModule,
    UsersModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService, SwaggerSetupService],
})
export class AppModule {}
