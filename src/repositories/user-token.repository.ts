import prisma from '@/lib/database/prisma';

export interface IUpsertUserToken {
  userId: number;
  token: string;
}

export interface IDeleteUserToken {
  userId: number;
}

export interface GetUserTokenOption {
  userId?: number;
  token?: string;
}
class UserTokenRepository {
  async upsertToken(data: IUpsertUserToken) {
    return await prisma.userToken.upsert({
      where: {
        userId: data.userId,
      },
      create: data,
      update: {
        token: data.token,
      },
    });
  }

  async getOne(option: GetUserTokenOption) {
    return await prisma.userToken.findFirst({
      where: option,
      include: {
        user: true,
      },
    });
  }

  async delete({ userId }: IDeleteUserToken) {
    return await prisma.userToken.delete({
      where: {
        userId,
      },
    });
  }
}

export default UserTokenRepository;
