import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
// decorators
import { User } from '@app/common/decorators';
// guards
// import { ApiKeyGuard } from './guards/api-key.guard';
// import { JwtAuthGuard } from './guards/jwt-auth.guard';
// dto
import { SignInDriverDto } from './dto/signin-driver.dto';
import { SignUpDriverDto } from './dto/signup-driver.dto';
import { RefreshTokenDriverDto } from './dto/refresh-token-driver.dto';
import { LogoutDriverDto } from './dto/logout-driver.dto';
// interface
import {
  IRefreshTokenResponse,
  ISignInDriverResponse
} from '../../../../../libs/common/src/interfaces/auth.interface';
// service
import { AuthProxyService } from './auth-proxy.service';

@ApiTags('auth')
@Controller('auth')
// @UseGuards(ApiKeyGuard)
export class AuthProxyController {
  constructor(
    private readonly authProxyService: AuthProxyService // @Inject(REQUEST) private request: Request
  ) {}

  @Post('/signup-account')
  @ApiOperation({
    summary: 'Đăng ký bằng email hoặc số điện thoại',
    description:
      'Đăng ký thông tin bắt buộc gồm (Họ tên, số điện thoại, mật khẩu), thành công luôn đăng nhập, trả về accessToken, refreshToken và thông tin driver'
  })
  @ApiOkResponse({
    status: 200,
    description: 'Đăng nhập thành công.',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'eyJhbGciOiJIUzI1NiIsInR5cC' },
        refreshToken: { type: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' },
        driver: {
          type: 'object',
          example: {
            fullName: 'Người dùng 01',
            phoneNumber: '0900000001',
            email: 'driver01@gmail.com',
            password:
              '$2b$08$8T/k.8XusTusA9RaOVZkT.BC4p2a9SpFAmw/iTr.xsawmZiqe2fzO',
            activeAreaId: 1,
            temporaryAddress: 'Phong Dien, Can Tho',
            identityCardFrontId: 1,
            identityCardBackId: 1,
            status: 'inactive',
            approvalStatus: 'draft',
            balance: 0,
            pin: '123456',
            isActive: true,
            serviceTypeIds: [],
            banks: [],
            emergencyContacts: [],
            vehicles: [],
            signatures: [],
            uniforms: [],
            availabilities: [],
            createdAt: '2025-08-11T23:36:30.990Z',
            updatedAt: '2025-08-11T23:36:30.990Z',
            driverId: '689a7e7e568b7b237866dfb3',
            id: '689a7e7e568b7b237866dfb3'
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
        message: { type: 'string', example: 'Tài xế đã tồn tại' },
        statusCode: { type: 'number', example: 400 },
        timestamp: { type: 'string', format: '2025-08-08T22:28:44.808Z' },
        success: { type: 'boolean', example: false },
        path: { type: 'string', example: '/auth/signup-account' },
        method: { type: 'string', example: 'POST' },
        errorName: { type: 'string', example: 'ServerError' }
      }
    }
  })
  @ApiBody({ type: SignUpDriverDto })
  signUp(@Body() dto: SignUpDriverDto) {
    return this.authProxyService.signUp(dto);
  }

  @Post('/signin-account')
  @ApiOperation({
    summary: 'Đăng nhập bằng email hoặc số điện thoại',
    description:
      'Đăng nhập với thông tin bắt buộc gồm (email hoặc số điện thoại, mật khẩu), trả về accessToken, refreshToken và thông tin driver'
  })
  @ApiBody({ type: SignInDriverDto })
  @ApiOkResponse({
    status: 200,
    description: 'Đăng nhập thành công.',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cC' },
        refreshToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
        },
        driver: {
          type: 'object',
          example: {
            fullName: 'Người dùng 01',
            phoneNumber: '0900000001',
            email: 'driver01@gmail.com',
            password:
              '$2b$08$8T/k.8XusTusA9RaOVZkT.BC4p2a9SpFAmw/iTr.xsawmZiqe2fzO',
            activeAreaId: 1,
            temporaryAddress: 'Phong Dien, Can Tho',
            identityCardFrontId: 1,
            identityCardBackId: 1,
            status: 'inactive',
            approvalStatus: 'draft',
            balance: 0,
            pin: '123456',
            isActive: true,
            serviceTypeIds: [],
            banks: [],
            emergencyContacts: [],
            vehicles: [],
            signatures: [],
            uniforms: [],
            availabilities: [],
            createdAt: '2025-08-11T23:36:30.990Z',
            updatedAt: '2025-08-11T23:36:30.990Z',
            driverId: '689a7e7e568b7b237866dfb3',
            id: '689a7e7e568b7b237866dfb3'
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
        messageCode: { type: 'string', example: 'DRIVER_NOT_FOUND' },
        message: { type: 'string', example: 'Không tìm thấy tài xế' },
        statusCode: { type: 'number', example: 400 },
        timestamp: { type: 'string', format: '2025-08-10T02:59:53.352Z' },
        success: { type: 'boolean', example: false },
        path: { type: 'string', example: '/auth/signin-account' },
        method: { type: 'string', example: 'POST' },
        errorName: { type: 'string', example: 'ServerError' }
      }
    }
  })
  signIn(@Body() dto: SignInDriverDto) {
    return this.authProxyService.signIn(dto);
  }

  @Post('/refresh-token')
  @ApiOperation({
    summary: 'Lấy cặp access token và refresh token mới',
    description:
      'Gửi refresh token cũ, trả về accessToken, refreshToken mới và thông tin driver'
  })
  @ApiOkResponse({
    status: 200,
    description: 'Lấy thông tin cặp access token và refresh token thành công.',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'eyJhbGciOiJIUzI1NiIsInR5cCI6' },
        refreshToken: { type: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' }
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
        timestamp: { type: 'string', format: '2025-08-08T22:28:44.808Z' },
        success: { type: 'boolean', example: false },
        path: { type: 'string', example: '/auth/refreshToken' },
        method: { type: 'string', example: 'POST' },
        errorName: { type: 'string', example: 'ServerError' }
      }
    }
  })
  async refreshToken(@Body() dto: RefreshTokenDriverDto) {
    return this.authProxyService.refreshToken(dto.refreshToken);
  }

  // @Post('/logout')
  // // @ApiBearerAuth()
  // // @UseGuards(JwtAuthGuard)
  // @ApiOperation({
  //   summary: 'Đăng xuất tài khoản',
  //   description:
  //     'Thêm access token và refresh token vào blacklist, trả về true.'
  // })
  // @ApiOkResponse({
  //   status: 200,
  //   description: 'Đăng xuất thành công.',
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       data: { type: 'boolean', example: true },
  //       success: { type: 'boolean', example: true }
  //     }
  //   }
  // })
  // @ApiBadRequestResponse({
  //   description: 'Bad request - Token đã thêm vào blacklist trước đó.',
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       messageCode: { type: 'string', example: 'INVALID_REFRESH_TOKEN' },
  //       message: { type: 'string', example: 'Refresh token không hợp lệ' },
  //       statusCode: { type: 'number', example: 401 },
  //       timestamp: { type: 'string', format: '2025-08-08T22:28:44.808Z' },
  //       success: { type: 'boolean', example: false },
  //       path: { type: 'string', example: '/auth/logout' },
  //       method: { type: 'string', example: 'POST' },
  //       errorName: { type: 'string', example: 'UnauthorizedException' }
  //     }
  //   }
  // })
  // logOut(
  //   @Body() dto: LogoutDriverDto,
  //   @User('driverId') driverId: string
  // ): Promise<boolean> {
  //   const authHeader = this.request.headers['authorization'] || '';
  //   const token = authHeader.replace('Bearer ', '');
  //   return this.authService.logOut(driverId, token, dto.refreshToken);
  // }
}
