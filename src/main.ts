import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerSetupService } from './swagger-setup.service';
import { CustomExceptionFilter } from './exceptions/custom-exception.filter';
import { CustomException } from './exceptions/custom.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (validationErrors) => {
        const errors = validationErrors.reduce((acc, error) => {
          const constraints = Object.values(error.constraints);
          acc[error.property] =
            constraints.length === 1 ? constraints[0] : constraints;
          return acc;
        }, {});

        throw new CustomException({
          statusCode: 422,
          message: 'Unprocessable Content!',
          errors,
        });
      },
    }),
  );

  app.useGlobalFilters(new CustomExceptionFilter());
  const swaggerSetupService = app.get(SwaggerSetupService);
  swaggerSetupService.setup(app);
  await app.listen(3000);
}
bootstrap();
