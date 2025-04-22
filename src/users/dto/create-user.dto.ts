import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {

  @ApiProperty({
    example: 'rainhard@email.com',
    required: true
  })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    example: 'password',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
