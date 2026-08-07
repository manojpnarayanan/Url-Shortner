import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Url, UrlSchema } from './schema/url.schema';
import { UrlRepository } from './url.repository';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { RedirectController } from './redirect.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }])],
  providers: [
    {
      provide: 'IUrlRepository',
      useClass: UrlRepository,
    },
    {
      provide: 'IUrlService',
      useClass: UrlService,
    },
    UrlService,
    UrlRepository,
  ],
  controllers: [UrlController, RedirectController],
  exports: ['IUrlService', 'IUrlRepository', UrlService, UrlRepository],
})
export class UrlModule {}
