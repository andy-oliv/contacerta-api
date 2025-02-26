import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { PrismaService } from '../prisma/prisma.service';
import Account from '../entities/Account';

@Injectable()
export class AccountService {
  constructor(
    private readonly logger: Logger,
    private readonly prismaService: PrismaService,
  ) {}

  async createAccount(
    accountData: Account,
  ): Promise<{ message: string; data: Account }> {
    return;
  }
}
