import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EmailService {
  constructor(private prisma: PrismaService) {}

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('Email is not registered');
    }

    const now = new Date();
    let forgotPasswordVerifyToken = user.forgotPassVerifyToken;
    let forgotPasswordTokenExpiry = user.forgotPassTokenExpiry;

    if (
      !forgotPasswordVerifyToken ||
      !forgotPasswordTokenExpiry ||
      forgotPasswordTokenExpiry < now
    ) {
      // generate new token if missing or expired
      forgotPasswordVerifyToken = uuidv4();
      forgotPasswordTokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          forgotPassVerifyToken: forgotPasswordVerifyToken,
          forgotPassTokenExpiry: forgotPasswordTokenExpiry,
        },
      });
    }

    const sendTo = {
      username: user.name,
      token: forgotPasswordVerifyToken,
    };

    return sendTo;
  }
}
