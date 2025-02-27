import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { AuthService } from './auth.service';
import LoginDTO from './DTOs/loginDTO';
import { Request, Response } from 'express';
import User from '../entities/User';
import { AuthGuard } from './auth.guard';
import RegisterDTO from './DTOs/registerUserDTO';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly logger: Logger,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(
    @Res({ passthrough: true }) response: Response,
    @Body() userData: RegisterDTO,
  ) {
    const loginData: LoginDTO = await this.authService.register(userData);
    return await this.login(loginData, response);
  }

  @Post('login')
  async login(
    @Body() loginInfo: LoginDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens: { accessToken: string; refreshToken: string } =
      await this.authService.login(loginInfo.email, loginInfo.password);

    this.logger.debug('tokens acquired');
    response.cookie('CC_accessToken', tokens.accessToken, {
      maxAge: 900000, //15 mins
      httpOnly: true,
    });

    response.cookie('CC_refreshToken', tokens.refreshToken, {
      maxAge: 604800000, //7 days
      httpOnly: true,
    });

    this.logger.debug('tokens are done');
    return { message: 'User successfully logged in.' };
  }

  @UseGuards(AuthGuard)
  @Get('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    response.clearCookie('CC_accessToken');
    response.clearCookie('CC_refreshToken');

    const userData: Partial<User> = request.user;
    console.log(userData);
    return await this.authService.logout(userData);
  }
}
