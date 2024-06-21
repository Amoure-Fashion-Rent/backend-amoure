import { NextFunction, Request, Response } from 'express';
import Unauthorized from '@errors/unauthorized.error';
import jwt from 'jsonwebtoken';
import { Role, User } from '@prisma/client';
import UserService from '@/services/user.service';
import UserRepository from '@/repositories/user.repository';
import { ACCESS_TOKEN_SECRET } from '@/lib/config';
import UserTokenRepository from '@/repositories/user-token.repository';
import { AccessTokenDto } from '@/domain/dtos/login.dto';

export type RequestWithUser = Request & {
  user: User;
};

export class AuthMiddleware {
  private userService: UserService;
  constructor() {
    const userRepository = new UserRepository();
    const userTokenRepository = new UserTokenRepository();
    this.userService = new UserService(userRepository, userTokenRepository);
  }

  private getToken(req: RequestWithUser) {
    const bearerHeader = req.headers['authorization'];

    if (!bearerHeader) {
      throw new Unauthorized();
    }

    const bearer = bearerHeader.split(' ');

    if (bearer.length != 2 || bearer[0] != 'Bearer') {
      throw new Unauthorized();
    }
    return bearer[1];
  }

  verify(roles: Role[]) {
    // @ts-ignore
    return async (req: RequestWithUser, res: Response, next: NextFunction) => {
      try {
        const token = this.getToken(req);
        const decoded = (await jwt.verify(token, ACCESS_TOKEN_SECRET)) as { user: AccessTokenDto };
        if (!decoded.user) {
          throw new Unauthorized();
        }
        if (!roles.includes(decoded.user.role)) {
          throw new Unauthorized();
        }
        req.user = await this.userService.findUser({ id: decoded.user.id });
        next();
      } catch (err) {
        if (err.name === 'TokenExpiredError') next(new Unauthorized('Token is expired'));
        next(err);
      }
    };
  }
}
