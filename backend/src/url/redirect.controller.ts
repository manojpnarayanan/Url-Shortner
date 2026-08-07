import { Controller, Get, Param, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { UrlService } from './url.service';
import { ROUTES } from '../common/constants/routes.constants';

@Controller(ROUTES.URLS.REDIRECT)
export class RedirectController {
  constructor(private readonly urlService: UrlService) {}

  @Get(':code')
  async redirect(@Param('code') code: string, @Res() res: Response) {
    const originalUrl = await this.urlService.redirect(code);
    return res.redirect(HttpStatus.FOUND, originalUrl);
  }
}
