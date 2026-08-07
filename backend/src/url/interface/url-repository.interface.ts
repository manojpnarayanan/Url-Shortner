import { Url } from '../schema/url.schema';

export interface IUrlRepository {
  findByCode(shortCode: string): Promise<Url | null>;
  findByUserId(userId: string): Promise<Url[]>;
  incrementClicks(shortCode: string): Promise<void>;
  create(data: Partial<Url>): Promise<Url>;
  findById(id: string): Promise<Url | null>;
  delete(id: string): Promise<boolean>;
}
