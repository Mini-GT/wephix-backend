import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import bcrypt from 'bcryptjs';
import { calculateCharges } from '../utils/calculateCharges';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getPaintCharges(id: string) {
    let userPaintCharges = await this.prisma.user.findUnique({
      where: { id },
      select: {
        charges: true,
        cooldownUntil: true,
      },
    });

    if (!userPaintCharges) {
      throw new NotFoundException('User not found');
    }

    const { charges, cooldownUntil } = calculateCharges(
      userPaintCharges.charges,
      userPaintCharges.cooldownUntil,
    );

    return { charges, cooldownUntil };
  }

  async getUserById(userId: string) {
    let user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        createdAt: true,
        email: true,
        name: true,
        profileImage: true,
        status: true,
        role: true,
        totalPixelsPlaced: true,
        discord: {
          select: {
            discordId: true,
            username: true,
            global_name: true,
            avatar: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { ...user };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const {
      currentName,
      newName,
      currentPassword,
      newPassword,
      confirmNewPassword,
      currentProfileImage,
      newProfileImage,
    } = updateUserDto;

    // update user name if new name is provided
    if (newName) {
      if (!newName.trim()) {
        throw new BadRequestException('Name cannot be empty');
      }

      // check if new name is different than current name
      if (newName !== currentName) {
        // if its different update current name
        await this.prisma.user.update({
          where: { id },
          data: {
            name: newName,
          },
        });
      }
    }

    // change profile image
    if (newProfileImage) {
      if (newProfileImage !== currentProfileImage) {
        await this.prisma.user.update({
          where: {
            id,
          },
          data: {
            profileImage: newProfileImage,
          },
        });
      }
    }

    // change password if password fields are not empty
    if (currentPassword && newPassword) {
      if (newPassword !== confirmNewPassword) {
        throw new BadRequestException(
          'New password and confirm password do not match',
        );
      }

      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        throw new NotFoundException("User doesn't exists");
      }

      // for users who are signed-in using gmail OAuth
      if (!user.password) {
        const hashedPassword = await bcrypt.hash(newPassword, 8);

        await this.prisma.user.update({
          where: {
            id,
          },
          data: {
            password: hashedPassword,
          },
        });

        return 'Password changed successfully';
      }

      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password,
      );

      if (!isCurrentPasswordValid) {
        throw new BadRequestException('Current password is incorrect');
      }

      const isSamePassword = await bcrypt.compare(newPassword, user.password);

      if (isSamePassword) {
        throw new BadRequestException(
          'New password must be different from current password',
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 8);

      await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      });
    }

    return 'Profile updated successfully';
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
