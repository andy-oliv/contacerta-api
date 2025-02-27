import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';
import VALIDATION_MESSAGES from '../../messages/validationMessages';

export default class LoginDTO {
  @ApiProperty({
    title: 'User email',
    description: 'valid email',
    required: true,
    example: 'john.doe@mail.com',
  })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.loginDTO.email.isNotEmpty })
  @IsEmail({}, { message: VALIDATION_MESSAGES.loginDTO.email.isEmail })
  email: string;

  @ApiProperty({
    title: 'User password',
    description:
      'strong password with at least 8 characters: 1 lowercase letter, 1 uppercase letter, 1 number, 1 symbol',
    required: true,
    example: 'M9L1n$%xj',
  })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.loginDTO.password.isNotEmpty })
  @IsStrongPassword(
    {
      minLength: 8,
    },
    {
      message: VALIDATION_MESSAGES.loginDTO.password.isStrongPassword,
    },
  )
  password: string;
}
