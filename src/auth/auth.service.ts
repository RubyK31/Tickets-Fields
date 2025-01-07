import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from './jwt-payload.interface';
import { LoginDto } from 'src/users/dto/login.dto';
import { CustomException } from 'src/exceptions/custom.exception';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Check if the user exists
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new CustomException({
        statusCode: 401,
        message: 'Unauthorized',
        errors: {
          email: 'No account found with the provided email.',
        },
      });
    }

    // Check if the password is correct
    const isPasswordValid = await this.usersService.comparePasswords(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new CustomException({
        statusCode: 401,
        message: 'Unauthorized',
        errors: {
          password: 'Incorrect password. Please try again.',
        },
      });
    }

    // Generate JWT token if validation is successful
    const payload: JwtPayload = { id: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async signup(username: string, email: string, password: string) {
    return this.usersService.createUser({ username, email, password });
  }
}
