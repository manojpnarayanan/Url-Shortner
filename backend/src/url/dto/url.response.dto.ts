export class UrlResponseDto {
  id!: string;
  originalUrl!: string;
  shortCode!: string;
  shortUrl!: string;
  clicks!: number;
  createdAt!: Date;

  constructor(partial: Partial<UrlResponseDto>) {
    Object.assign(this, partial);
  }
}
