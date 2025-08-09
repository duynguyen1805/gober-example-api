import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ApiKeyGuard } from './guards/api-key.guard';
import { SignInDriverDto } from './dto/signin-driver.dto';
import { SignUpDriverDto } from './dto/signup-driver.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
// @UseGuards(ApiKeyGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(REQUEST) private request: Request
  ) {}

  @Post('/signup-account')
  @ApiBody({ type: SignUpDriverDto })
  signupAccount(@Body() dto: SignUpDriverDto) {
    return this.authService.signUp(dto);
  }

  @Post('/signin-account')
  @ApiBody({ type: SignInDriverDto })
  loginAccount(@Body() dto: SignInDriverDto) {
    return this.authService.signIn(dto);
  }

  @Post('/refresh-token')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  logOut(@Body('refreshToken') refreshToken: string) {
    const authHeader = this.request.headers['authorization'] || '';
    const token = authHeader.replace('Bearer ', '');
    return this.authService.logOut(token, refreshToken);
  }
}
