import { Module } from '@nestjs/common';
import { UserGatewayService } from './user-gateway.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule],
  providers: [UserGatewayService],
  exports: [UserGatewayService],
})
export class UserGatewayModule {}
