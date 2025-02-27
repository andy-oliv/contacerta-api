import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserGatewayModule } from '../user-gateway/user-gateway.module';

@Module({
  imports: [PrismaModule, UserGatewayModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
