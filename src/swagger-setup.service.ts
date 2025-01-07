// swagger-setup.service.ts
import { Injectable } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

@Injectable()
export class SwaggerSetupService {
  setup(app: INestApplication) {
    const options = new DocumentBuilder()
      .setTitle('NestJS Ticket Management API')
      .setDescription('The API documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document); // This will be the URL to access Swagger UI
  }
}
