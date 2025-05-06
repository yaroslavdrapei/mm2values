import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ApikeysService } from 'src/apikeys/apikeys.service';

@Injectable()
export class ApikeyGuard implements CanActivate {
  constructor(private apikeysService: ApikeysService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const httpContext: Request = context.switchToHttp().getRequest();

    const apikey = httpContext.headers.authorization;
    if (!apikey) return false;

    return await this.apikeysService.validateKey(apikey);
  }
}
