import { IsEmail, IsString, Matches } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email' })
  @Matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/i, {
    message: 'Please provide a valid Gmail address (e.g. user@gmail.com)',
  })
  email!: string;

  @IsString()
  password!: string;
}
