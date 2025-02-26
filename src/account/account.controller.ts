import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccountService } from './account.service';
import { Logger } from 'nestjs-pino';
import createAccountDTO from './DTOs/createAccountDTO';

@ApiTags('Account')
@Controller('account')
export class AccountController {
  constructor(
    private readonly logger: Logger,
    private readonly accountService: AccountService,
  ) {}

  @ApiOperation({
    summary: 'Endpoint for account creation.',
  })
  @Post()
  async createAccount(@Body() accountData: createAccountDTO) {
    return accountData;
  }
}
