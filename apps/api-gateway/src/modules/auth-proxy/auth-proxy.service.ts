// apps/api-gateway/src/modules/auth-proxy/auth-proxy.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
// dto
import { SignInDriverDto } from './dto/signin-driver.dto';
import { SignUpDriverDto } from './dto/signup-driver.dto';
// interface
import {
  IRefreshTokenResponse,
  ISignInDriverResponse
} from '@app/common/interfaces/auth.interface';

@Injectable()
export class AuthProxyService {
  constructor(@Inject('AUTH_SERVICE') private client: ClientProxy) {}

  /**
   * Đăng nhập tài khoảnh Driver
   * @param driver SignInDriverDto để đăng nhập
   * @returns token, refreshToken, thông tin driver
   * @throws EError nếu có giá trị không hợp lệ
   */
  async signIn(driver: SignInDriverDto) {
    // const signInResult = await this.signInUseCase.signIn(driver);

    // return {
    //   token: signInResult.token,
    //   refreshToken: signInResult.refreshToken,
    //   driver: signInResult.driver
    // };
    return this.client.send('sign-in', driver);
  }

  /**
   * Đăng ký tài khoản Driver
   * @param user SignUpDriverDto để đăng ký
   * @returns Sau khi đăng ký thành công, thực hiện đăng nhập trả về token, refreshToken, thông tin driver
   * @throws EError nếu có giá trị không hợp lệ
   */
  async signUp(user: SignUpDriverDto) {
    // const userRegistered = await this.signUpUseCase.signUpAccount(user);

    // return this.signIn({
    //   identifier: userRegistered.email,
    //   password: user.password
    // });

    return this.client.send('sign-up', user);
  }

  /**
   * Cấp lại token và refreshToken cho driver
   * @param oldRefreshToken refresh token cũ
   * @returns access token mới, refreshToken mới
   */
  async refreshToken(oldRefreshToken: string) {
    // return await this.refreshTokenUseCase.getRefreshToken(oldRefreshToken);

    return this.client.send('refresh-token', oldRefreshToken);
  }

  /**
   * Thu hồi access token và refresh token của driver
   * @param driverId id của driver
   * @param token access token
   * @param refreshToken refresh token
   * @returns true nếu thu hồi thành công
   */
  async logOut(driverId: string, token: string, refreshToken: string) {
    // return this.logoutUseCase.addTokenToBlackList(
    //   driverId,
    //   token,
    //   refreshToken
    // );

    return this.client.send('log-out', {
      driverId,
      token,
      refreshToken
    });
  }
}
