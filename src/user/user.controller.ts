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
} from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { UserService } from './user.service';
import CreateUserDTO from './DTOs/createUserDTO';
import UpdateUserDTO from './DTOs/updateUserDTO';
import HTTP_MESSAGES from '../messages/httpMessages';
import * as dayjs from 'dayjs';

@Controller('user')
export class UserController {
  constructor(
    private readonly logger: Logger,
    private readonly userService: UserService,
  ) {}

  @Post()
  async createUser(@Body() userData: CreateUserDTO) {
    return await this.userService.createUser(userData);
  }

  @Get()
  async fetchUsers() {
    return await this.userService.fetchUsers();
  }

  @Get(':id')
  async fetchUser(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.userService.fetchUser(id);
  }

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

  @Delete(':id')
  async deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.userService.deleteUser(id);
  }
}
