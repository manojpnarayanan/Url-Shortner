import { Controller, Get, Param, Res, HttpStatus, Inject } from '@nestjs/common';
import { Response } from 'express';
import { UrlService } from './url.service';
import { ROUTES } from '../common/constants/routes.constants';
import { IUrlService } from './interface/url-service.interface';

@Controller(ROUTES.URLS.REDIRECT)
export class RedirectController {
  constructor(@Inject("IUrlService") private readonly _urlService: IUrlService) {}

  @Get(':code')
  async redirect(@Param('code') code: string, @Res() res: Response) {
    const originalUrl = await this._urlService.redirect(code);
    return res.redirect(HttpStatus.FOUND, originalUrl);
  }
}
