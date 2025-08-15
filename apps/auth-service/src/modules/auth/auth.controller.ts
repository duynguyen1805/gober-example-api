import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
// decorators
import { User } from '@app/common/decorators/user.decorator';
// guards
import { ApiKeyGuard } from '@app/common/guards/api-key.guard';
import { JwtAuthGuard } from '@app/common/guards/jwt-auth.guard';
// dto
import { SignInDriverDto } from '@app/common/dto/auth/signin-driver.dto';
import { SignUpDriverDto } from '@app/common/dto/auth/signup-driver.dto';
import { RefreshTokenDriverDto } from '@app/common/dto/auth/refresh-token-driver.dto';
import { LogoutDriverDto } from '@app/common/dto/auth/logout-driver.dto';
// interface
import {
  IRefreshTokenResponse,
  ISignInDriverResponse
} from '@app/common/interfaces/auth.interface';
// service
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
// @UseGuards(ApiKeyGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(REQUEST) private request: Request
  ) {}

  @MessagePattern({ cmd: 'signUp' })
  signUp(dto: SignUpDriverDto): Promise<ISignInDriverResponse> {
    return this.authService.signUp(dto);
  }

  @MessagePattern({ cmd: 'signIn' })
  signIn(dto: SignInDriverDto): Promise<ISignInDriverResponse> {
    return this.authService.signIn(dto);
  }

  @MessagePattern({ cmd: 'refreshToken' })
  async refreshToken(
    @Body() dto: RefreshTokenDriverDto
  ): Promise<IRefreshTokenResponse> {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @MessagePattern({ cmd: 'logOut' })
  logOut(
    @Body() dto: LogoutDriverDto,
    @User('driverId') driverId: string
  ): Promise<boolean> {
    const authHeader = this.request.headers['authorization'] || '';
    const token = authHeader.replace('Bearer ', '');
    return this.authService.logOut(driverId, token, dto.refreshToken);
  }
}
