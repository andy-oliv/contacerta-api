import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { UserService } from './user.service';
import CreateUserDTO from './DTOs/createUserDTO';
import UpdateUserDTO from './DTOs/updateUserDTO';
import HTTP_MESSAGES from '../messages/httpMessages';
import * as dayjs from 'dayjs';
import { AuthGuard } from '../auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly logger: Logger,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async createUser(@Body() userData: CreateUserDTO) {
    return await this.userService.createUser(userData);
  }

  @UseGuards(AuthGuard)
  @Get()
  async fetchUsers() {
    return await this.userService.fetchUsers();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async fetchUser(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.userService.fetchUser(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateUser(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatedData: UpdateUserDTO,
  ) {
    if (updatedData === undefined) {
      this.logger.debug({
        message: HTTP_MESSAGES.user.update.status_400,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });

      throw new BadRequestException({
        message: HTTP_MESSAGES.user.update.status_400,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });
    }

    return await this.userService.updateUser(id, updatedData);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.userService.deleteUser(id);
  }
}
