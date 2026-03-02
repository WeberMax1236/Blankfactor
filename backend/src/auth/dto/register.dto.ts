import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterDto {

  @ApiProperty({
    example: 'leo123',
    description: 'Unique username for user account',
  })
  @IsString()
  username: string;

  @ApiProperty({
    example: 'leo@email.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123',
    description: 'Password must contain letters and numbers',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain letters and numbers',
  })
  password: string;
}