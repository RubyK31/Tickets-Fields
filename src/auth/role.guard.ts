import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Fetch user role from the database
    const userRole = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { roleId: true },
    });

    if (!userRole) {
      throw new ForbiddenException('User role not found');
    }

    // admin role
    if (userRole.roleId === 1) {
      return true;
    }

    throw new ForbiddenException(
      'Access denied for performing this operation!',
    );
  }
}
