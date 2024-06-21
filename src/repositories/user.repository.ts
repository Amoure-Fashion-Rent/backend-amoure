import { Role } from '@prisma/client';
import prisma from '@/lib/database/prisma';

export interface IInsertUser {
  fullName: string;
  email: string;
  password: string;
  role: Role;
}

export interface IUpdateUser {
  fullName?: string;
  addressDetail?: string;
  province?: string;
  district?: string;
  postalCode?: string;
  phoneNumber?: string;
  birthDate?: Date;
}

export interface GetUserOption {
  id?: number;
  email?: string;
}

class UserRepository {
  async getOne({ id, email }: GetUserOption) {
    const where = {
      ...(id ? { id } : {}),
      ...(email ? { email } : {}),
    };
    return await prisma.user.findFirst({
      where,
    });
  }

  async create(data: IInsertUser) {
    return await prisma.user.create({
      data,
    });
  }

  async update(id: number, data: IUpdateUser) {
    return await prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }
}

export default UserRepository;
