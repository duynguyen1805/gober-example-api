// apps/api-gateway/src/modules/auth-proxy/auth-proxy.service.ts
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { firstValueFrom, Observable } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
// dto
import { SignInDriverDto } from '../../../../../libs/common/src/dto/auth/signin-driver.dto';
import { SignUpDriverDto } from '../../../../../libs/common/src/dto/auth/signup-driver.dto';
// interface
import {
  IRefreshTokenResponse,
  ISignInDriverResponse
} from '@app/common/interfaces/auth.interface';

@Injectable()
export class AuthProxyService implements OnModuleInit {
  constructor(@Inject('AUTH_SERVICE') private client: ClientProxy) {}

  async onModuleInit() {
    // Chờ connect xong trước khi dùng send()
    await this.client.connect();
    Logger.log('[AuthProxyService] Connected to AUTH_SERVICE queue');
  }

  /**
   * Đăng nhập tài khoảnh Driver
   * @param driver SignInDriverDto để đăng nhập
   * @returns token, refreshToken, thông tin driver
   * @throws EError nếu có giá trị không hợp lệ
   */
  async signIn(
    driver: SignInDriverDto
  ): Promise<Observable<ISignInDriverResponse>> {
    // const signInResult = await this.signInUseCase.signIn(driver);

    // return {
    //   token: signInResult.token,
    //   refreshToken: signInResult.refreshToken,
    //   driver: signInResult.driver
    // };
    const result = await firstValueFrom(
      this.client.send({ cmd: 'signIn' }, driver)
    );
    return result;
  }

  /**
   * Đăng ký tài khoản Driver
   * @param user SignUpDriverDto để đăng ký
   * @returns Sau khi đăng ký thành công, thực hiện đăng nhập trả về token, refreshToken, thông tin driver
   * @throws EError nếu có giá trị không hợp lệ
   */
  async signUp(
    user: SignUpDriverDto
  ): Promise<Observable<ISignInDriverResponse>> {
    const userRegistered = await firstValueFrom(
      this.client.send({ cmd: 'signUp' }, user)
    );
    const userSignedIn = await firstValueFrom(
      this.client.send(
        { cmd: 'signIn' },
        {
          identifier: userRegistered.email,
          password: user.password
        }
      )
    );
    return userSignedIn;
  }

  /**
   * Cấp lại token và refreshToken cho driver
   * @param oldRefreshToken refresh token cũ
   * @returns access token mới, refreshToken mới
   */
  async refreshToken(
    oldRefreshToken: string
  ): Promise<Observable<IRefreshTokenResponse>> {
    const result = await firstValueFrom(
      this.client.send({ cmd: 'refreshToken' }, oldRefreshToken)
    );
    return result;
  }

  /**
   * Thu hồi access token và refresh token của driver
   * @param driverId id của driver
   * @param token access token
   * @param refreshToken refresh token
   * @returns true nếu thu hồi thành công
   */
  async logOut(
    driverId: string,
    token: string,
    refreshToken: string
  ): Promise<Observable<boolean>> {
    const result = await firstValueFrom(
      this.client.send({ cmd: 'logOut' }, { driverId, token, refreshToken })
    );
    return result;
  }
}
