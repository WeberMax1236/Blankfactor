import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class LoginDto {

  /**
   * User login email
   * Must be valid email format
   */
  @IsEmail()
  email: string;

  /**
   * User password
   * Must match password rules used during registration
   */
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;

}