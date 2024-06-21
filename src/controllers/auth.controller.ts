import { Request, Router } from 'express';
import UserRepository from '@/repositories/user.repository';
import UserService from '@/services/user.service';
import Controller from '@interfaces/controller';
import { registerSchema } from '@/domain/schemas/register.schema';
import { validateRequest } from '@middlewares/validate.middleware';
import { handleRequest } from '@utils/handle-request';
import { BaseResponse } from '@interfaces/base-response';
import { loginSchema, updateProfileSchema } from '@/domain/schemas/login.schema';
import UserTokenRepository from '@/repositories/user-token.repository';
import { Role, User } from '@prisma/client';
import { AuthMiddleware, RequestWithUser } from '@middlewares/auth.middleware';
import { StatusCodes } from 'http-status-codes';
import { AuthResponse } from '@/domain/dtos/register.dto';

class AuthController implements Controller {
  public path = '/auth';
  public router = Router();
  private userService: UserService;
  private authMiddleware: AuthMiddleware;
  constructor() {
    const userRepository = new UserRepository();
    const userTokenRepository = new UserTokenRepository();
    this.userService = new UserService(userRepository, userTokenRepository);
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  register = async (req: Request): Promise<BaseResponse<AuthResponse>> => {
    const { user, accessToken, refreshToken } = await this.userService.register(req.body);
    return {
      status: StatusCodes.CREATED,
      data: {
        user: this.mapUserResponse(user),
        accessToken,
        refreshToken,
      },
    };
  };

  login = async (req: Request): Promise<BaseResponse<AuthResponse>> => {
    const { user, accessToken, refreshToken } = await this.userService.login(req.body);
    return {
      data: {
        user: this.mapUserResponse(user),
        accessToken,
        refreshToken,
      },
    };
  };

  logout = async (req: RequestWithUser): Promise<BaseResponse<any>> => {
    await this.userService.logout(req.user.id);
    return { message: 'Logout successful.' };
  };

  updateProfile = async (req: RequestWithUser) => {
    const updatedProfile = await this.userService.updateUser(req.body, req.user.id);
    return { message: 'Profile updated successfully', data: updatedProfile };
  };

  getProfile = async (req: RequestWithUser) => {
    const profile = await this.userService.getProfile(req.user.id);
    return { message: 'Profile retrieved successfully', data: profile };
  };

  initializeRoutes = () => {
    this.router.post(`${this.path}/register`, validateRequest(registerSchema), handleRequest(this.register));
    this.router.post(`${this.path}/login`, validateRequest(loginSchema), handleRequest(this.login));
    this.router.delete(`${this.path}/logout`, [this.authMiddleware.verify([Role.OWNER, Role.USER])], handleRequest(this.logout));
    this.router.patch(
      `${this.path}/profile`,
      [this.authMiddleware.verify([Role.OWNER, Role.USER])],
      validateRequest(updateProfileSchema),
      handleRequest(this.updateProfile),
    );
    this.router.get(`${this.path}/profile`, [this.authMiddleware.verify([Role.OWNER, Role.USER])], handleRequest(this.getProfile));
  };

  private mapUserResponse(user: User) {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };
  }
}

export default AuthController;
