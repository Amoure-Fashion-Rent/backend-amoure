import { IInsertUser } from '@/repositories/user.repository';

export type RegisterRequest = IInsertUser;

export interface AuthResponse {
  user: {
    fullName: string;
    email: string;
    id: number;
  };
  accessToken: string;
  refreshToken: string;
}
