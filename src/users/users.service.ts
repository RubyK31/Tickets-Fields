/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { BaseRepository } from 'src/common/repository/base.repository';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private baseRepository: BaseRepository,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    return this.usersRepository.createUser(createUserDto);
  }

  async findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async getAllUsers(pageNumber: number) {
    const orderBy = { id: 'desc' };
    return this.baseRepository.findAll('user', pageNumber, orderBy);
  }

  async getUserById(id: number) {
    return this.baseRepository.findById('user', id);
  }
  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const uniqueCheck = {
      email: updateUserDto.email,
    };
    return this.baseRepository.update('user', id, updateUserDto, uniqueCheck);
  }

  async deleteUser(id: number) {
    return this.baseRepository.deleteById('user', id);
  }

  async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  //jwt-strategy calls this...
  async findById(id: number) {
    return this.usersRepository.findById(id);
  }
}
