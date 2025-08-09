import { Injectable } from '@nestjs/common';
import { SignInDriverDto } from './dto/signin-driver.dto';
import { SignUpDriverDto } from './dto/signup-driver.dto';
import { SignUpUseCase } from './use-cases/sign-up.use-case';
import { SignInUseCase } from './use-cases/sign-in.use-case';
import { RefreshTokenUseCase } from './use-cases/refresh-token.use-case';
import { LogOutUseCase } from './use-cases/logout.use-case';
// import {
//   Mailer,
//   EEmailTemplate
// } from '../../common/helpers/email-helpers/mailer.helper';
import {
  IRefreshTokenResponse,
  ISignInDriverResponse
} from './interface/auth-driver.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly signUpUseCase: SignUpUseCase,
    private readonly signInUseCase: SignInUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogOutUseCase
  ) {}

  async signIn(driver: SignInDriverDto): Promise<ISignInDriverResponse> {
    const signInResult = await this.signInUseCase.signIn(driver);

    return {
      token: signInResult.token,
      refreshToken: signInResult.refreshToken,
      driver: signInResult.driver
    };
  }

  async signUp(user: SignUpDriverDto): Promise<ISignInDriverResponse> {
    const userRegistered = await this.signUpUseCase.signUpAccount(user);

    return this.signIn({
      identifier: userRegistered.email,
      password: user.password
    });
  }

  async refreshToken(oldRefreshToken: string): Promise<IRefreshTokenResponse> {
    return await this.refreshTokenUseCase.getRefreshToken(oldRefreshToken);
  }

  async logOut(token: string, refreshToken: string) {
    return this.logoutUseCase.addTokenToBlackList(token, refreshToken);
  }
}
