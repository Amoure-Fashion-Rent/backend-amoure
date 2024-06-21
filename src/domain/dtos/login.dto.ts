import { Role } from '@prisma/client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AccessTokenDto {
  id: number;
  email: string;
  fullName: string;
  role: Role;
}
