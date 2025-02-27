import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from 'nestjs-pino';
import { UserGatewayService } from '../user-gateway/user-gateway.service';
import HTTP_MESSAGES from '../messages/httpMessages';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly logger: Logger,
    private readonly userGatewayService: UserGatewayService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const accessToken: string = request.cookies.CC_accessToken;
    const refreshToken: string = request.cookies.CC_refreshToken;

    this.logger.log('looking for the access token.');
    if (accessToken) {
      const userData =
        await this.userGatewayService.checkAccessToken(accessToken);
      this.logger.log('access token found! Proceeding with the request.');
      if (userData) {
        request.user = userData;
        return true;
      }
    }

    this.logger.log('access token not found! Checking the refresh token.');
    if (!refreshToken) {
      throw new UnauthorizedException(HTTP_MESSAGES.global.status_403);
    }

    const checkedToken =
      await this.userGatewayService.checkRefreshToken(refreshToken);
    if (!checkedToken) {
      throw new UnauthorizedException(HTTP_MESSAGES.global.status_403);
    }

    this.logger.log(
      'generating new access token and proceeding with the request.',
    );
    const newAccessToken =
      await this.userGatewayService.updateAccessToken(checkedToken);
    response.cookie('CC_accessToken', newAccessToken, {
      maxAge: 900000,
      httpOnly: true,
    });

    request.user = checkedToken;
    return true;
  }
}
