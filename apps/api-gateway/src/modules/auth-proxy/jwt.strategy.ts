import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  CACHE_MANAGER,
  Get,
  Inject,
  Injectable,
  UseGuards
} from '@nestjs/common';
import { jwtConstants } from '@app/common/constants';
import { Cache } from 'cache-manager';
import { ERedisKey } from '@app/common/enums/redis.enum';
import { makeSure, mustExist } from '@app/common/helpers/server-error.helper';
import { EError } from '@app/common/enums/error.enum';
import { IJWTPayload } from '@app/common/interfaces/auth.interface';
import { DriverProxyService } from '@app/proxy/driver-proxy/driver-proxy.service';
import { CacheService } from '@app/common/cache/cache.service';

@Injectable()
/* It extends the PassportStrategy class and overrides the validate method */
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * The constructor function is used to inject the UserService and CacheManager into the JwtStrategy
   * class
   * @param {DriverProxyService} driverProxyService - This is the service that we created earlier.
   * @param {Cache} cacheManager - This is the cache manager that we injected in the constructor.
   */
  constructor(
    private driverProxyService: DriverProxyService,
    private cacheService: CacheService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
      passReqToCallback: true
    });
  }

  /**
   * It takes the payload from the JWT, gets the user's permissions from the cache, and if they're not
   * there, it gets them from the database, and then returns the payload with the permissions added
   * @param {any} payload - The payload that was sent to the server.
   * @returns The payload data, and the permissions.
   */
  async validate(req: Request, payload: IJWTPayload) {
    /* Getting the email and id from the payload.data, then it is getting the permissions from the
    cache. If the permissions are not in the cache, it gets them from the database. */
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace('Bearer ', '');

    // Check blacklist token trong redis
    const isBlacklisted = await this.cacheService.get(
      `${ERedisKey.BLACKLIST_TOKEN_PREFIX}${token}`
    );
    if (isBlacklisted) {
      makeSure(false, EError.TOKEN_IN_BLACKLIST, null, 401);
    }

    // Kiểm tra driver tồn tại
    const driverId = payload.data.driverId;
    mustExist(driverId, 'UNAUTHORIZED', null, 401);
    const driver = await this.driverProxyService.findDriverById(driverId);
    mustExist(driver, 'UNAUTHORIZED', null, 401);

    return { ...payload.data };
  }
}
