import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AccountModule } from './account/account.module';
import { LoggerModule } from 'nestjs-pino';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UserGatewayModule } from './user-gateway/user-gateway.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src', 'assets'),
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: 'debug',
        redact: ['id', 'password'],
        transport: {
          targets: [
            {
              target: 'pino-pretty',
              level: 'debug',
              options: { colorize: true },
            },
            {
              target: '@logtail/pino',
              level: 'debug',
              options: {
                sourceToken: process.env.BETTERSTACK_TOKEN,
                options: {
                  endpoint: 'http://s1217095.eu-nbg-2.betterstackdata.com',
                },
              },
            },
          ],
        },
      },
    }),
    PrismaModule,
    AccountModule,
    UserModule,
    AuthModule,
    UserGatewayModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
