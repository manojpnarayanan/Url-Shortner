import { CreateUrlDto } from '../dto/create-url.dto';
import { UrlResponseDto } from '../dto/url.response.dto';


export interface IUrlService {
  create(dto: CreateUrlDto, userId: string): Promise<UrlResponseDto>;
  findAllByUser(userId: string): Promise<UrlResponseDto[]>;
  redirect(code: string): Promise<string>;
  delete(id: string, userId: string): Promise<void>;
  getBaseUrl():string;
}
