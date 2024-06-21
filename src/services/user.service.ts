import UserRepository, { GetUserOption, IUpdateUser } from '@/repositories/user.repository';
import bcrypt from 'bcrypt';
import BadRequest from '@errors/bad-request.error';
import NotFound from '@errors/not-found.error';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '@/lib/config';
import Unauthorized from '@errors/unauthorized.error';
import UserTokenRepository from '@/repositories/user-token.repository';
import { RefreshTokenPayload } from '@/domain/dtos/auth.dto';
import { RegisterRequest } from '@/domain/dtos/register.dto';
import { AccessTokenDto, LoginRequest } from '@/domain/dtos/login.dto';

class UserService {
  constructor(
    private userRepository: UserRepository,
    private userTokenRepository: UserTokenRepository,
  ) {}

  async findUser(option: GetUserOption) {
    const user = await this.userRepository.getOne(option);
    if (!user) {
      throw new NotFound(`User with ${option.id ? 'id' : 'email'} ${option.id || option.email} not found`);
    }
    return user;
  }

  async getProfile(id: number) {
    const { password, ...user } = await this.findUser({ id });
    return user;
  }

  async updateUser(data: IUpdateUser, userId: number) {
    const { password, ...userData } = await this.userRepository.update(userId, data);
    return userData;
  }

  async login(loginDto: LoginRequest) {
    const user = await this.findUser({ email: loginDto.email });
    if (!(await bcrypt.compare(loginDto.password, user.password))) {
      throw new Unauthorized('Invalid Credentials');
    }

    const accessToken = await this.generateToken({ id: user.id, role: user.role, email: user.email, fullName: user.fullName });
    const refreshToken = await this.generateRefreshToken({ id: user.id, role: user.role, email: user.email, fullName: user.fullName });
    return { user, accessToken, refreshToken };
  }

  async register(registerPayload: RegisterRequest) {
    if (await this.userRepository.getOne({ email: registerPayload.email })) {
      throw new BadRequest('Validation Error', { email: 'Email is already taken' });
    }
    registerPayload.password = await bcrypt.hash(registerPayload.password, 10);
    const user = await this.userRepository.create(registerPayload);

    const accessToken = await this.generateToken({ id: user.id, role: user.role, email: user.email, fullName: user.fullName });
    const refreshToken = await this.generateRefreshToken({ id: user.id, role: user.role, email: user.email, fullName: user.fullName });

    return { user, accessToken, refreshToken };
  }

  async logout(userId: number) {
    const token = await this.userTokenRepository.getOne({ userId });
    if (token) {
      await this.userTokenRepository.delete({ userId });
    }
  }

  async refreshToken({ refreshToken }: RefreshTokenPayload) {
    try {
      jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
      const existingToken = await this.userTokenRepository.getOne({ token: refreshToken });
      if (!existingToken) throw new Unauthorized();
      const { user } = existingToken;
      const accessToken = await this.generateToken({ id: user.id, role: user.role, email: user.email, fullName: user.fullName });

      return { accessToken };
    } catch (err) {
      if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        throw new Unauthorized('Invalid or expired refresh token');
      }
      throw new Unauthorized();
    }
  }

  generateToken = async (user: AccessTokenDto) => {
    return jwt.sign({ user }, ACCESS_TOKEN_SECRET, { expiresIn: '8h' });
  };

  generateRefreshToken = async (user: AccessTokenDto) => {
    const refreshToken = jwt.sign({ user }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    await this.userTokenRepository.upsertToken({ userId: user.id, token: refreshToken });
    return refreshToken;
  };
}

export default UserService;
