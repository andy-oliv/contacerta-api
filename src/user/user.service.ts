import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import * as dayjs from 'dayjs';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import User from '../entities/User';
import HTTP_MESSAGES from '../messages/httpMessages';

@Injectable()
export class UserService {
  constructor(
    private readonly logger: Logger,
    private readonly prismaService: PrismaService,
  ) {}

  async createUser(userData: User): Promise<{ message: string; data: User }> {
    const foundUser: User = await this.prismaService.user.findUnique({
      where: {
        email: userData.email,
      },
    });

    if (foundUser) {
      throw new ConflictException({
        message: HTTP_MESSAGES.user.create.status_409,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });
    }

    const id: string = uuidv4();
    const saltRounds: number = process.env.SALT_ROUNDS
      ? parseInt(process.env.SALT_ROUNDS)
      : 12;
    const hash: string = await bcrypt.hash(userData.password, saltRounds);

    try {
      const newUser: User = await this.prismaService.user.create({
        data: {
          id,
          username: userData.username,
          email: userData.email,
          password: hash,
          profilePictureUrl: `${process.env.API_DOMAIN}/uploads/avatar_placeholder.png`,
        },
      });

      return { message: HTTP_MESSAGES.user.create.status_200, data: newUser };
    } catch (error) {
      this.logger.error({
        message: HTTP_MESSAGES.user.create.status_500,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });

      throw new InternalServerErrorException({
        message: HTTP_MESSAGES.user.create.status_500,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });
    }
  }

  async fetchUsers(): Promise<{ message: string; data: User[] }> {
    try {
      const userList: User[] = await this.prismaService.user.findMany();

      if (userList.length === 0) {
        throw new NotFoundException({
          message: HTTP_MESSAGES.user.fetchAll.status_404,
          pid: process.pid,
          timestamp: dayjs().format('DD/MM/YYYY'),
        });
      }

      return {
        message: HTTP_MESSAGES.user.fetchAll.status_200,
        data: userList,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error({
        message: HTTP_MESSAGES.user.fetchAll.status_500,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });

      throw new InternalServerErrorException({
        message: HTTP_MESSAGES.user.fetchAll.status_500,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });
    }
  }

  async fetchUser(id: string): Promise<{ message: string; data: User }> {
    try {
      const user: User = await this.prismaService.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        throw new NotFoundException({
          message: HTTP_MESSAGES.user.fetchOne.status_404,
          pid: process.pid,
          timestamp: dayjs().format('DD/MM/YYYY'),
        });
      }

      return { message: HTTP_MESSAGES.user.fetchOne.status_200, data: user };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error({
        message: HTTP_MESSAGES.user.fetchOne.status_500,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });

      throw new InternalServerErrorException({
        message: HTTP_MESSAGES.user.fetchOne.status_500,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });
    }
  }

  async updateUser(
    id: string,
    updatedData: Partial<User>,
  ): Promise<{ message: string; data: User }> {
    try {
      const updatedUser: User = await this.prismaService.user.update({
        where: {
          id,
        },
        data: {
          username: updatedData.username,
          profilePictureUrl: updatedData.profilePictureUrl,
          email: updatedData.email,
        },
      });

      return {
        message: HTTP_MESSAGES.user.update.status_200,
        data: updatedUser,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException({
          message: HTTP_MESSAGES.user.update.status_404,
          pid: process.pid,
          timestamp: dayjs().format('DD/MM/YYYY'),
        });
      }

      this.logger.error({
        message: HTTP_MESSAGES.user.update.status_500,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });

      throw new InternalServerErrorException({
        message: HTTP_MESSAGES.user.update.status_500,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });
    }
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const foundUser: User = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!foundUser) {
      throw new NotFoundException({
        message: HTTP_MESSAGES.user.delete.status_404,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });
    }

    try {
      await this.prismaService.user.delete({
        where: {
          id,
        },
      });

      return { message: HTTP_MESSAGES.user.delete.status_200 };
    } catch (error) {
      this.logger.error({
        message: HTTP_MESSAGES.user.delete.status_500,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });

      throw new InternalServerErrorException({
        message: HTTP_MESSAGES.user.delete.status_500,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });
    }
  }
}
