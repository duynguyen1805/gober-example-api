import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ApiKeyGuard } from './guards/api-key.guard';
import { SignInDriverDto } from './dto/signin-driver.dto';
import { SignUpDriverDto } from './dto/signup-driver.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  IRefreshTokenResponse,
  ISignInDriverResponse
} from './interface/auth-driver.interface';
import { RefreshTokenDriverDto } from './dto/refresh-token-driver.dto';
import { LogoutDriverDto } from './dto/logout-driver.dto';

@ApiTags('auth')
@Controller('auth')
// @UseGuards(ApiKeyGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(REQUEST) private request: Request
  ) {}

  @Post('/signup-account')
  @ApiOperation({
    summary: 'Đăng ký bằng email hoặc số điện thoại',
    description:
      'Đăng ký thành công trả về accessToken, refreshToken và thông tin driver'
  })
  @ApiResponse({
    status: 200,
    description: 'Đăng nhập thành công.',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
        driver: {
          type: 'object',
          example: {
            isActive: true,
            createdAt: '2025-08-08T22:28:44.808Z',
            updatedAt: '2025-08-08T22:28:44.808Z',
            deletedAt: null,
            driverId: 3,
            fullName: 'Nguyen Van A',
            phoneNumber: '0907123456',
            email: 'driver01@gmail.com',
            deviceToken: null,
            lastLogin: null,
            emailVerifiedAt: null,
            avatar: 1,
            activeAreaId: 1,
            temporaryAddress: 'Phong Dien, Can Tho',
            identityCardFrontId: 1,
            identityCardBackId: 1,
            status: 'inactive',
            submittedAt: null,
            approvalStatus: 'draft',
            approvedAt: null,
            approvedById: null,
            approvedNote: null,
            createdById: null,
            balance: 0
          }
        }
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Driver đã tồn tại',
    schema: {
      type: 'object',
      properties: {
        messageCode: { type: 'string', example: 'DRIVER_EXIST' },
        message: { type: 'string', example: 'DRIVER_EXIST' },
        statusCode: { type: 'number', example: 400 },
        timestamp: { type: 'string', format: 'date-time' },
        success: { type: 'boolean', example: false },
        path: { type: 'string', example: '/auth/signup-account' },
        method: { type: 'string', example: 'POST' },
        errorName: { type: 'string', example: 'ServerError' }
      }
    }
  })
  @ApiBody({ type: SignUpDriverDto })
  signUp(@Body() dto: SignUpDriverDto): Promise<ISignInDriverResponse> {
    return this.authService.signUp(dto);
  }

  @Post('/signin-account')
  @ApiOperation({
    summary: 'Đăng nhập bằng email hoặc số điện thoại',
    description:
      'Đăng nhập trả về accessToken, refreshToken và thông tin driver'
  })
  @ApiBody({ type: SignInDriverDto })
  @ApiResponse({
    status: 200,
    description: 'Đăng nhập thành công.',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
        driver: {
          type: 'object',
          example: {
            isActive: true,
            createdAt: '2025-08-08T01:53:06.753Z',
            updatedAt: '2025-08-08T01:53:06.753Z',
            deletedAt: null,
            driverId: 1,
            fullName: 'John Driver',
            phoneNumber: '0901234567',
            email: 'john.driver@example.com',
            deviceToken: null,
            lastLogin: null,
            emailVerifiedAt: null,
            avatar: null,
            activeAreaId: 1,
            temporaryAddress: null,
            identityCardFrontId: null,
            identityCardBackId: null,
            status: 'active',
            submittedAt: null,
            approvalStatus: 'draft',
            approvedAt: null,
            approvedById: 1,
            approvedNote: null,
            createdById: 1,
            balance: 0
          }
        }
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Driver không tồn tại',
    schema: {
      type: 'object',
      properties: {
        messageCode: { type: 'string', example: 'USER_NOT_FOUND' },
        message: { type: 'string', example: 'USER_NOT_FOUND' },
        statusCode: { type: 'number', example: 400 },
        timestamp: { type: 'string', format: 'date-time' },
        success: { type: 'boolean', example: false },
        path: { type: 'string', example: '/auth/signin-account' },
        method: { type: 'string', example: 'POST' },
        errorName: { type: 'string', example: 'ServerError' }
      }
    }
  })
  signIn(@Body() dto: SignInDriverDto): Promise<ISignInDriverResponse> {
    return this.authService.signIn(dto);
  }

  @Post('/refresh-token')
  @ApiOperation({
    summary: 'Lấy cặp access token và refresh token mới',
    description: 'Trả về accessToken, refreshToken và thông tin driver'
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin cặp access token và refresh token thành công.',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' }
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Refresh token không hợp lệ',
    schema: {
      type: 'object',
      properties: {
        messageCode: { type: 'string', example: 'INVALID_REFRESH_TOKEN' },
        message: { type: 'string', example: 'INVALID_REFRESH_TOKEN' },
        statusCode: { type: 'number', example: 400 },
        timestamp: { type: 'string', format: 'date-time' },
        success: { type: 'boolean', example: false },
        path: { type: 'string', example: '/auth/refreshToken' },
        method: { type: 'string', example: 'POST' },
        errorName: { type: 'string', example: 'ServerError' }
      }
    }
  })
  async refreshToken(
    @Body() dto: RefreshTokenDriverDto
  ): Promise<IRefreshTokenResponse> {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Post('/logout')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Đăng xuất tài khoản',
    description:
      'Thêm access token và refresh token vào blacklist, trả về true.'
  })
  @ApiResponse({
    status: 200,
    description: 'Đăng xuất thành công.',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'boolean', example: true },
        success: { type: 'boolean', example: true }
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Token đã thêm vào blacklist',
    schema: {
      type: 'object',
      properties: {
        messageCode: { type: 'string', example: 'INVALID_REFRESH_TOKEN' },
        message: { type: 'string', example: 'Token is blacklisted' },
        statusCode: { type: 'number', example: 401 },
        timestamp: { type: 'string', format: 'date-time' },
        success: { type: 'boolean', example: false },
        path: { type: 'string', example: '/auth/logout' },
        method: { type: 'string', example: 'POST' },
        errorName: { type: 'string', example: 'UnauthorizedException' }
      }
    }
  })
  logOut(@Body() dto: LogoutDriverDto): Promise<boolean> {
    const authHeader = this.request.headers['authorization'] || '';
    const token = authHeader.replace('Bearer ', '');
    return this.authService.logOut(token, dto.refreshToken);
  }
}
