/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BaseRepository {
  constructor(protected prisma: PrismaService) {}

  async findById(
    modelName: string,
    id: number,
    include?: Record<string, any>,
  ): Promise<any> {
    const model = await this.prisma[modelName].findUnique({
      where: { id },
      include: include,
    });

    if (!model) {
      throw new NotFoundException(
        `${modelName.charAt(0).toUpperCase() + modelName.slice(1)} not found`,
      );
    }
    return model;
  }

  async findAll(
    modelName: string,
    orderBy?: object,
    include?: Record<string, any>,
  ): Promise<any> {
    const models = await this.prisma[modelName].findMany({
      orderBy,
      include,
    });
    if (!models || models.length === 0) {
      throw new NotFoundException(
        `No ${modelName.charAt(0).toUpperCase() + modelName.slice(1)} records found.`,
      );
    }
    const count = await this.prisma[modelName].count();
    return {
      count: count,
      data: models,
    };
  }
  async deleteById(modelName: string, id: number) {
    const model = await this.findById(modelName, id); // Check if the model exists first
    if (!model) {
      throw new NotFoundException(
        `${modelName.charAt(0).toUpperCase() + modelName.slice(1)} not found`,
      );
    }
    return this.prisma[modelName].delete({
      where: { id },
    });
  }
  async create<T>(
    modelName: string,
    dto: any,
    uniqueCheckFields?: object,
  ): Promise<any> {
    if (uniqueCheckFields) {
      const existingModel = await this.prisma[modelName].findUnique({
        where: uniqueCheckFields,
      });

      if (existingModel) {
        throw new ConflictException(
          `${modelName.charAt(0).toUpperCase() + modelName.slice(1)} already exists.`,
        );
      }
    }

    try {
      return await this.prisma[modelName].create({
        data: dto,
      });
    } catch (error) {
      throw error;
    }
  }

  async update<T>(
    modelName: string,
    id: number,
    dto: any,
    uniqueCheckFields?: object,
  ): Promise<any> {
    const model = await this.findById(modelName, id);
    if (!model) {
      throw new NotFoundException(
        `${modelName.charAt(0).toUpperCase() + modelName.slice(1)} not found`,
      );
    }
    if (uniqueCheckFields) {
      const existingModel = await this.prisma[modelName].findUnique({
        where: uniqueCheckFields,
      });

      if (existingModel && existingModel.id !== id) {
        throw new ConflictException(
          `${modelName.charAt(0).toUpperCase() + modelName.slice(1)} already exists.`,
        );
      }
    }
    try {
      return await this.prisma[modelName].update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      throw error;
    }
  }
}
