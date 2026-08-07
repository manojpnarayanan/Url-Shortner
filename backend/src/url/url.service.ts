import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { nanoid } from 'nanoid';
import { Types } from 'mongoose';
import { CreateUrlDto } from './dto/create-url.dto';
import { UrlResponseDto } from './dto/url.response.dto';
import { URL_MESSAGES } from '../common/constants/messages.constants';
import { ConfigService } from '@nestjs/config';
import { UrlMapper } from './mappers/url.mappers';
import { IUrlService } from './interface/url-service.interface';
import { IUrlRepository } from './interface/url-repository.interface';

@Injectable()
export class UrlService implements IUrlService {
  private readonly baseUrl: string;

  constructor(
    @Inject('IUrlRepository')
    private readonly urlRepo: IUrlRepository,
    private readonly config: ConfigService,
  ) {
    this.baseUrl = config.get<string>('BASE_URL', 'http://localhost:5000');
  }

  private normalizeUrl(url: string): string {
    let trimmed = url.trim();
    if (!/^https?:\/\//i.test(trimmed)) {
      trimmed = `https://${trimmed}`;
    }
    return trimmed;
  }

  async create(dto: CreateUrlDto, userId: string): Promise<UrlResponseDto> {
    const formattedOriginalUrl = this.normalizeUrl(dto.originalUrl);
    const shortCode = dto.customAlias?.trim() || nanoid(7);

    const existing = await this.urlRepo.findByCode(shortCode);
    if (existing) {
      throw new ConflictException(URL_MESSAGES.ALIAS_TAKEN);
    }

    const url = await this.urlRepo.create({
      originalUrl: formattedOriginalUrl,
      shortCode,
      customAlias: dto.customAlias?.trim() || null,
      userId: new Types.ObjectId(userId),
      clicks: 0,
    });

    return UrlMapper.toResponseDto(url, this.baseUrl);
  }

  async findAllByUser(userId: string): Promise<UrlResponseDto[]> {
    const urls = await this.urlRepo.findByUserId(userId);
    return urls.map((u) => UrlMapper.toResponseDto(u, this.baseUrl));
  }

  async redirect(code: string): Promise<string> {
    const url = await this.urlRepo.findByCode(code);
    if (!url) {
      throw new NotFoundException(URL_MESSAGES.NOT_FOUND);
    }
    await this.urlRepo.incrementClicks(code);
    return url.originalUrl;
  }

  async delete(id: string, userId: string): Promise<void> {
    const url = await this.urlRepo.findById(id);
    if (!url) {
      throw new NotFoundException(URL_MESSAGES.NOT_FOUND);
    }
    if (url.userId.toString() !== userId) {
      throw new ForbiddenException(URL_MESSAGES.FORBIDDEN_DELETE);
    }
    await this.urlRepo.delete(id);
  }
}
