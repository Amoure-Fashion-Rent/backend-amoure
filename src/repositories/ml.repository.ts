import prisma from '@/lib/database/prisma';
import { NgrokType } from '@prisma/client';

export interface IUpdateNgrok {
  url: string;
  type: NgrokType;
}

export interface GetNgrokOption {
  type: NgrokType;
}

export class MLRepository {
  ngrokUrl: string;

  async updateNgrok(data: IUpdateNgrok) {
    const ngrok = await prisma.ngrokUrl.findFirst({ where: { type: data.type } });
    if (!ngrok) {
      return await prisma.ngrokUrl.create({
        data: {
          name: data.url,
          type: data.type,
        },
      });
    } else {
      return await prisma.ngrokUrl.updateMany({
        where: {
          type: data.type,
        },
        data: {
          name: data.url,
        },
      });
    }
  }

  async getNgrok({ type }: GetNgrokOption) {
    const ngrok = await prisma.ngrokUrl.findFirst({
      where: {
        type,
      },
    });
    return ngrok;
  }
}
