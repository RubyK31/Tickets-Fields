import { HttpException } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(response: { statusCode: number; message: string; errors?: any }) {
    super(response, response.statusCode);
  }

  getResponse() {
    return super.getResponse() as {
      statusCode: number;
      message: string;
      errors?: any;
    };
  }
}
