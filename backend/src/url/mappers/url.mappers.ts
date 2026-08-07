import { Url } from '../schema/url.schema';
import { UrlResponseDto } from '../dto/url.response.dto';

export class UrlMapper {
  static toResponseDto(url: Url, baseUrl: string): UrlResponseDto {
    return new UrlResponseDto({
      id: url._id.toString(),
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      shortUrl: `${baseUrl}/r/${url.shortCode}`,
      clicks: url.clicks,
      createdAt: (url as unknown as { createdAt: Date }).createdAt ?? new Date(),
    });
  }
}
