import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Url } from './schema/url.schema';
import { BaseRepository } from '../common/repository/base.repository';
import { IUrlRepository } from './interface/url-repository.interface';

@Injectable()
export class UrlRepository
  extends BaseRepository<Url>
  implements IUrlRepository
{
  constructor(@InjectModel(Url.name) private readonly urlModel: Model<Url>) {
    super(urlModel);
  }

  async findByCode(shortCode: string): Promise<Url | null> {
    return this.urlModel.findOne({ shortCode }).exec();
  }

  async findByUserId(userId: string): Promise<Url[]> {
    return this.urlModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async incrementClicks(shortCode: string): Promise<void> {
    await this.urlModel
      .findOneAndUpdate({ shortCode }, { $inc: { clicks: 1 } })
      .exec();
  }
}
