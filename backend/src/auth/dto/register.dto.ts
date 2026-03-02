import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class RegisterDto {

  /**
   * Username displayed in the platform
   * Must be 3-20 characters
   * Only letters, numbers, underscore allowed
   */
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscore',
  })
  username: string;

  /**
   * User login email
   * Must be valid email format
   */
  @IsEmail()
  email: string;

  /**
   * User password
   * Must contain letters and numbers
   * Length: 8 - 32 characters
   */
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'Password must contain at least one letter and one number',
  })
  password: string;
}