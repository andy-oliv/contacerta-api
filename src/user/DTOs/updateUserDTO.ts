import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import VALIDATION_MESSAGES from '../../messages/validationMessages';
import { ApiProperty } from '@nestjs/swagger';

export default class UpdateUserDTO {
  @ApiProperty({
    title: 'User full name',
    description: 'user full name',
    required: true,
    example: 'John Doe',
  })
  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.userDTO.username.isNotString })
  username: string;

  @ApiProperty({
    title: 'Password',
    description:
      'strong password with at least 8 characters: 1 symbol, 1 number, 1 lowercase letter, 1 uppercase letter',
    required: true,
    example: 'Em$8911vjUk@',
  })
  @IsOptional()
  @IsStrongPassword(
    {
      minLength: 8,
    },
    {
      message: VALIDATION_MESSAGES.userDTO.password.isStrongPassword,
    },
  )
  password: string;

  @ApiProperty({
    title: 'Email',
    description: 'valid email according to the format: johndoe@mail.com',
    required: false,
    example: 'jane.doe@email.com.br',
  })
  @IsOptional()
  @IsEmail({}, { message: VALIDATION_MESSAGES.userDTO.email.isEmail })
  email: string;
}
