import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerSetupService } from './swagger-setup.service';
import { ValidationExceptionFilter } from './exceptions/validation-exception.filter';
import { ValidationException } from './exceptions/validation.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (validationErrors) => {
        const errors = validationErrors.reduce((acc, error) => {
          const constraints = Object.values(error.constraints);
          //console.log(error.constraints);
          acc[error.property] =
            constraints.length === 1 ? constraints[0] : constraints;
          return acc;
        }, {});

        throw new ValidationException({
          statusCode: 422,
          message: 'Unprocessable Content!',
          errors,
        });
      },
    }),
  );

  app.useGlobalFilters(new ValidationExceptionFilter());
  const swaggerSetupService = app.get(SwaggerSetupService);
  swaggerSetupService.setup(app);
  await app.listen(3000);
}
bootstrap();
