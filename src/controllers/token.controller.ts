import Controller from '@interfaces/controller';
import { Request, Router } from 'express';
import UserService from '@/services/user.service';
import UserRepository from '@/repositories/user.repository';
import UserTokenRepository from '@/repositories/user-token.repository';
import { handleRequest } from '@utils/handle-request';
import { BaseResponse } from '@interfaces/base-response';
import { validateRequest } from '@middlewares/validate.middleware';
import { refreshTokenSchema } from '@/domain/schemas/token.schema';
import { RefreshTokenResponse } from '@/domain/dtos/auth.dto';

class TokenController implements Controller {
  public path = '/token';
  public router = Router();
  private userService: UserService;

  constructor() {
    const userRepository = new UserRepository();
    const userTokenRepository = new UserTokenRepository();
    this.userService = new UserService(userRepository, userTokenRepository);
    this.initializeRoutes();
  }

  refresh = async (req: Request): Promise<BaseResponse<RefreshTokenResponse>> => {
    const accessToken = await this.userService.refreshToken(req.body);
    return { message: 'Token refreshed.', data: accessToken };
  };

  private initializeRoutes() {
    this.router.post(`${this.path}/refresh`, validateRequest(refreshTokenSchema), handleRequest(this.refresh));
  }
}

export default TokenController;
