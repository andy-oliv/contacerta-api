import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import VALIDATION_MESSAGES from '../../messages/validationMessages';

export default class createAccountDTO {
  @ApiProperty({
    title: 'Description',
    description: 'the user is able to insert a name for their type of account',
    required: true,
    example: 'Savings account',
  })
  @IsNotEmpty({
    message: VALIDATION_MESSAGES.accountDTO.description.isNotEmpty,
  })
  @IsString({ message: VALIDATION_MESSAGES.accountDTO.description.isString })
  description: string;

  @ApiProperty({
    title: 'Icon URL',
    description:
      'the link to an svg or ico image that will be used as icon for the account',
    required: true,
    example: 'http://google.com/images/a0491k0d0kafafk',
  })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.accountDTO.iconUrl.isNotEmpty })
  @IsString({ message: VALIDATION_MESSAGES.accountDTO.iconUrl.isString })
  iconUrl: string;

  @ApiProperty({
    title: 'Color',
    description: 'the hex or rgb code for the color of the icon',
    required: true,
    example: '#000000',
  })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.accountDTO.color.isNotEmpty })
  @IsString({ message: VALIDATION_MESSAGES.accountDTO.color.isString })
  color: string;

  @ApiProperty({
    title: 'Balance',
    description: 'the starting account balance',
    required: true,
    example: '2000',
  })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.accountDTO.balance.isNotEmpty })
  @IsNumber(
    { allowNaN: false, maxDecimalPlaces: 2 },
    { message: VALIDATION_MESSAGES.accountDTO.balance.isNumber },
  )
  balance: number;
}
