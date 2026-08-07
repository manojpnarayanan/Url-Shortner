import { IsEmail, IsString, MinLength, Matches, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Please provide a valid email' })
  @Matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/i, {
    message: 'Registration requires a valid Gmail address (e.g. user@gmail.com)',
  })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password!: string;
}
