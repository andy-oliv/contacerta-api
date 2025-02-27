import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { PrismaService } from '../prisma/prisma.service';
import User from '../entities/User';
import { JwtService } from '@nestjs/jwt';
import * as dayjs from 'dayjs';

@Injectable()
export class UserGatewayService {
  constructor(
    private readonly logger: Logger,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async generateTokens(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: { email: string; name: string; profilePic: string } = {
      email: user.email,
      name: user.username,
      profilePic: user.profilePictureUrl,
    };

    const accessToken: string = await this.jwtService.signAsync(payload, {
      issuer: `${process.env.API_DOMAIN}`,
      expiresIn: '15m',
      secret: process.env.JWT_SECRET,
    });

    const refreshToken: string = await this.jwtService.signAsync(payload, {
      issuer: `${process.env.API_DOMAIN}`,
      expiresIn: '7d',
      secret: process.env.JWT_SECRET,
    });

    this.logger.log({
      message: 'new tokens successfully generated',
      pid: process.pid,
      timestamp: dayjs().format('DD/MM/YYYY'),
    });

    await this.insertRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async insertRefreshToken(userId: string, refreshToken: string) {
    this.logger.log({
      message: 'Inserting the refresh token into the database',
      pid: process.pid,
      timestamp: dayjs().format('DD/MM/YYYY'),
    });
    try {
      await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          refreshToken,
        },
      });
    } catch (error) {
      this.logger.log(error.message);
    }
  }

  async updateAccessToken(userData: Partial<User>) {
    const payload: { email: string; name: string; profilePic: string } = {
      email: userData.email,
      name: userData.username,
      profilePic: userData.profilePictureUrl,
    };

    const accessToken: string = await this.jwtService.signAsync(payload, {
      issuer: `${process.env.API_DOMAIN}`,
      expiresIn: '15m',
      secret: process.env.JWT_SECRET,
    });

    this.logger.log({
      message: 'new accessToken successfully generated',
      pid: process.pid,
      timestamp: dayjs().format('DD/MM/YYYY'),
    });

    return accessToken;
  }

  async checkAccessToken(token: string) {
    try {
      const userData = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      return userData;
    } catch (error) {
      this.logger.warn({
        message: 'An error occurred while verifying the access token.',
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });
      return error;
    }
  }

  async checkRefreshToken(token: string) {
    try {
      const userData = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      return userData;
    } catch (error) {
      this.logger.warn({
        message: 'An error occurred while verifying the refresh token.',
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });
      return error;
    }
  }

  async revokeRefreshToken(email: string) {
    try {
      await this.prismaService.user.update({
        where: {
          email,
        },
        data: {
          refreshToken: null,
        },
      });
    } catch (error) {
      this.logger.error({
        message: '',
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });

      throw new InternalServerErrorException({
        message: '',
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });
    }
  }
}
