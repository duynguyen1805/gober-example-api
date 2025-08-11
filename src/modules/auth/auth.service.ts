import { Injectable } from '@nestjs/common';
// dto
import { SignInDriverDto } from './dto/signin-driver.dto';
import { SignUpDriverDto } from './dto/signup-driver.dto';
// interface
import {
  IRefreshTokenResponse,
  ISignInDriverResponse
} from './interface/auth-driver.interface';
// use-case
import { SignUpUseCase } from './use-cases/sign-up.use-case';
import { SignInUseCase } from './use-cases/sign-in.use-case';
import { RefreshTokenUseCase } from './use-cases/refresh-token.use-case';
import { LogOutUseCase } from './use-cases/logout.use-case';

@Injectable()
export class AuthService {
  constructor(
    private readonly signUpUseCase: SignUpUseCase,
    private readonly signInUseCase: SignInUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogOutUseCase
  ) {}

  /**
   * Đăng nhập tài khoảnh Driver
   * @param driver SignInDriverDto để đăng nhập
   * @returns token, refreshToken, thông tin driver
   * @throws EError nếu có giá trị không hợp lệ
   */
  async signIn(driver: SignInDriverDto): Promise<ISignInDriverResponse> {
    const signInResult = await this.signInUseCase.signIn(driver);

    return {
      token: signInResult.token,
      refreshToken: signInResult.refreshToken,
      driver: signInResult.driver
    };
  }

  /**
   * Đăng ký tài khoản Driver
   * @param user SignUpDriverDto để đăng ký
   * @returns Sau khi đăng ký thành công, thực hiện đăng nhập trả về token, refreshToken, thông tin driver
   * @throws EError nếu có giá trị không hợp lệ
   */
  async signUp(user: SignUpDriverDto): Promise<ISignInDriverResponse> {
    const userRegistered = await this.signUpUseCase.signUpAccount(user);

    return this.signIn({
      identifier: userRegistered.email,
      password: user.password
    });
  }

  /**
   * Cấp lại token và refreshToken cho driver
   * @param oldRefreshToken refresh token cũ
   * @returns access token mới, refreshToken mới
   */
  async refreshToken(oldRefreshToken: string): Promise<IRefreshTokenResponse> {
    return await this.refreshTokenUseCase.getRefreshToken(oldRefreshToken);
  }

  /**
   * Thu hồi access token và refresh token của driver
   * @param driverId id của driver
   * @param token access token
   * @param refreshToken refresh token
   * @returns true nếu thu hồi thành công
   */
  async logOut(driverId: number, token: string, refreshToken: string) {
    return this.logoutUseCase.addTokenToBlackList(
      driverId,
      token,
      refreshToken
    );
  }
}
