import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import User from '../entities/User';
import * as bcrypt from 'bcrypt';
import * as dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { UserGatewayService } from '../user-gateway/user-gateway.service';
import HTTP_MESSAGES from '../messages/httpMessages';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
    private readonly userGatewayService: UserGatewayService,
  ) {}

  async register(userData: User): Promise<{ email: string; password: string }> {
    const foundUser: User = await this.prismaService.user.findUnique({
      where: {
        email: userData.email,
      },
    });

    if (foundUser) {
      throw new ConflictException({
        message: HTTP_MESSAGES.auth.register.status_409,
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

      return { email: newUser.email, password: userData.password };
    } catch (error) {
      this.logger.error({
        message: HTTP_MESSAGES.auth.register.status_500,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });

      throw new InternalServerErrorException({
        message: HTTP_MESSAGES.auth.register.status_500,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });
    }
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user: User = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      this.logger.error({
        message: HTTP_MESSAGES.auth.login.status_400,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });
    }

    const validatePassword: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (!validatePassword) {
      this.logger.error({
        message: HTTP_MESSAGES.auth.login.status_400,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });

      throw new BadRequestException({
        message: HTTP_MESSAGES.auth.login.status_400,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });
    }

    try {
      this.logger.log({
        message: 'generating new tokens',
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });

      const tokens: { accessToken: string; refreshToken: string } =
        await this.userGatewayService.generateTokens(user);

      return tokens;
    } catch (error) {
      this.logger.error({
        message: HTTP_MESSAGES.auth.login.status_500,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });

      throw new InternalServerErrorException({
        message: HTTP_MESSAGES.auth.login.status_500,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });
    }
  }

  async logout(userData: Partial<User>): Promise<{ message: string }> {
    console.log(userData);
    try {
      await this.userGatewayService.revokeRefreshToken(userData.email);
      return { message: HTTP_MESSAGES.auth.logout.status_200 };
    } catch (error) {
      this.logger.error({
        message: HTTP_MESSAGES.auth.logout.status_500,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });

      throw new InternalServerErrorException({
        message: HTTP_MESSAGES.auth.logout.status_500,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });
    }
  }
}
