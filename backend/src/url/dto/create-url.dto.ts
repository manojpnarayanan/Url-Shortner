import { IsUrl, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateUrlDto {
  @IsUrl({ require_protocol: false }, { message: 'Please provide a valid URL' })
  originalUrl!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'Custom alias max 20 characters' })
  customAlias?: string;
}
