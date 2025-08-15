import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
// module.repository
import {
  DriverRefreshToken,
  DriverRefreshTokenDocument,
  DriverRefreshTokenDocumentWithCustomId
} from '@app/database/schemas/driver-refresh-token.schema';

@Injectable()
export class DriverRefreshTokenModelRepository {
  constructor(
    @InjectModel(DriverRefreshToken.name)
    private readonly driveRefreshTokenModelRepository: Model<DriverRefreshTokenDocument>
  ) {}

  /**
   * Tạo mới DriverRefreshTokenDocument
   * @param input Partial<DriverRefreshTokenDocumentWithCustomId>
   * @returns DriverRefreshTokenDocument: thông tin bảng driver refresh token
   */
  async createDriverRefreshToken(
    input: Partial<DriverRefreshTokenDocumentWithCustomId>
  ): Promise<DriverRefreshTokenDocument> {
    const payload = (input as any).input ?? input;
    const driverRefreshTokenDocument =
      new this.driveRefreshTokenModelRepository(payload);
    return await driverRefreshTokenDocument.save();
  }

  /**
   * Lưu thông tin driver refresh token
   * @param driverRefreshToken DriverRefreshTokenDocument: thông tin bảng driver refresh token
   * @returns DriverRefreshTokenDocumentWithCustomId: thông tin bảng driver refresh token
   */
  async saveDriverRefreshToken(
    driverRefreshToken: DriverRefreshTokenDocumentWithCustomId
  ): Promise<DriverRefreshTokenDocument> {
    return await driverRefreshToken.save();
  }

  /**
   * Cập nhật trạng thái của driver refresh token
   * @param criteria Partial<DriverRefreshTokenDocumentWithCustomId>: các điều kiện để tìm kiếm
   * @param input Partial<DriverRefreshTokenDocumentWithCustomId>: các giá trị cần cập nhật
   * @returns Promise<boolean>: true nếu cập nhật thành công
   */
  async updateDriverRefreshToken(
    criteria: Partial<DriverRefreshTokenDocumentWithCustomId>,
    input: Partial<DriverRefreshTokenDocumentWithCustomId>
  ): Promise<boolean> {
    const updateResult = await this.driveRefreshTokenModelRepository.updateOne(
      {
        driverId: criteria?.driverId,
        token: criteria?.token
      },
      {
        isRevoked: input?.isRevoked
      }
    );
    return updateResult.modifiedCount > 0;
  }
}
