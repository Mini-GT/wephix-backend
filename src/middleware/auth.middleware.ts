import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from 'src/types/express';
import { isTokenExpired, verifyJwt } from 'src/utils/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private config: ConfigService) {}

  use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token = req.cookies?.loginToken;
    const NODE_ENV = this.config.get('NODE_ENV');

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const { id, exp } = verifyJwt(token, process.env.jwtsecretKey!) as {
        id: string;
        exp: number;
      };

      const isExpired = isTokenExpired(exp);

      if (isExpired) {
        res.clearCookie('loginToken', {
          httpOnly: true,
          secure: NODE_ENV,
          sameSite: 'strict',
        });
        res.clearCookie('hasLoginToken', {
          httpOnly: false,
          secure: NODE_ENV,
          sameSite: 'strict',
        });

        throw new UnauthorizedException('Token expired');
      } else {
        req.userId = id;
      }

      next();
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
