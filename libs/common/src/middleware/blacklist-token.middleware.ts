// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import { CacheService } from '../../modules/cache/cache.service';
// import { ERedisKey } from '../enums/redis.enum';
// import { makeSure } from '../helpers/server-error.helper';
// import { EError } from '../enums';

// @Injectable()
// export class BlacklistMiddleware implements NestMiddleware {
//   constructor(private cacheService: CacheService) {}

//   async use(req: Request, res: Response, next: NextFunction) {
//     const authHeader = req.headers['authorization'] || '';
//     const token = authHeader.replace('Bearer ', '');
//     if (token) {
//       const isBlacklisted = await this.cacheService.get(
//         `${ERedisKey.BLACKLIST_TOKEN_PREFIX}${token}`
//       );
//       if (isBlacklisted) {
//         makeSure(false, EError.TOKEN_IN_BLACKLIST, null, 401);
//       }
//     }
//     next();
//   }
// }
