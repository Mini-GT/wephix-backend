import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, NextFunction } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthenticatedRequest } from 'src/types/express';
import { isTokenExpired, verifyJwt } from 'src/utils/jwt';

@Injectable()
export class AdminMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const userId = req.userId;

    //check if user exist and has admin role
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
      },
    });

    if (user?.role.toLowerCase() !== 'admin') {
      throw new UnauthorizedException('Unauthorized');
    }

    next();
  }
}
