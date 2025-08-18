import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { isNil } from 'lodash';
// helpers
import { makeSure, mustExist } from '@app/common/helpers/index';
import { EError } from '@app/common/enums/error.enum';
import { ERequestStatus } from '@app/common/enums/request.enum';
// dto
import { UpdateDriverRequestDto } from '../../../../../../libs/common/src/dto/driver-request/update-driver-request.dto';
// schema
import { DriverRequestDocumentWithCustomId } from '@app/database/schemas/driver-request.schema';
// model.repository
import { DriverRequestModelRepository } from '../driver-request.model.repository';

import { RequestTypeModelRepository } from '../../../modules/request-type/request-type.model.repository';

@Injectable()
export class UpdateDriverRequestInfomationUseCase {
  private driverRequestExists: DriverRequestDocumentWithCustomId;
  constructor(
    private readonly driverRequestModelRepository: DriverRequestModelRepository,
    private readonly requestTypeModelRepository: RequestTypeModelRepository,
    @Inject('FILE_SERVICE') private fileServiceClient: ClientProxy
  ) {}

  /**
   * Thực hiện cập nhật thông tin driver, chỉ áp dụng khi request còn ở trạng thái "pending"
   *
   * @param driverId - id chỉ định driver cần cập nhật thông tin, lấy từ token
   * @param input - Thông tin cần cập nhật
   * @returns Thông tin driver sau khi cập nhật
   * @throws EError trả lỗi nếu validate thất bại hoặc cập nhật không thành công
   */

  async execute(
    driverId: string,
    driverRequestId: string,
    input: UpdateDriverRequestDto
  ): Promise<DriverRequestDocumentWithCustomId> {
    // validate input
    await this.validateUpdateDriverInformationDto(
      driverId,
      driverRequestId,
      input
    );

    this.driverRequestExists.toObject().fileIds = input.fileIds;

    Object.assign(this.driverRequestExists, {
      ...input,
      fileIds: this.driverRequestExists.fileIds
    });
    return this.driverRequestModelRepository.saveDriverRequest(
      this.driverRequestExists
    );
  }

  /**
   * Validate UpdateDriverRequestDto trước khi request cập nhật thông tin driver
   * @param driverId - id chỉ định driver cần cập nhật thông tin, lấy từ token
   * @param input - UpdateDriverRequestDto object để validate
   * @throws EError nếu có giá trị không hợp lệ
   */
  async validateUpdateDriverInformationDto(
    driverId: string,
    driverRequestId: string,
    input: UpdateDriverRequestDto
  ): Promise<void> {
    // Kiểm tra driverRequestId
    if (driverRequestId) {
      makeSure(driverRequestId.length > 0, EError.INVALID_DRIVER_REQUEST_ID);
    }

    // Kiểm tra driver đã tồn tại, và còn ở trạng thái Pending
    this.driverRequestExists =
      await this.driverRequestModelRepository.findDriverRequestByFilter({
        driverId: driverId,
        driverRequestId: driverRequestId
      });
    mustExist(this.driverRequestExists, EError.DRIVER_NOT_FOUND);
    makeSure(
      this.driverRequestExists.status === ERequestStatus.Pending,
      EError.REQUEST_IS_PROCESSING
    );

    // Kiểm tra các trường có thông tin trong input
    // Kiểm tra code
    if (input?.code) {
      makeSure(input.code.length === 6, EError.INVALID_CODE_DRIVER_REQUEST);
    }
    // Kiểm tra description
    if (input?.description) {
      makeSure(
        input.description.length > 0,
        EError.INVALID_DESCRIPTION_DRIVER_REQUEST
      );
    }

    // Kiểm tra fileId
    if (input?.fileIds && input.fileIds.length > 0) {
      for (const fileId of input.fileIds) {
        makeSure(fileId.length > 0, EError.INVALID_FILE_ID);
        const file = await this.fileServiceClient.send(
          'findFileByIdById',
          fileId
        );
        makeSure(!isNil(file), EError.INVALID_FILE_ID);
      }
    }

    // Kiểm tra typeId
    if (input?.typeId) {
      makeSure(input?.typeId.length > 0, EError.INVALID_REQUEST_TYPE_ID);
      // Kiểm tra thêm typeId có tồn tại trong bảng RequestType
      const requestTypeResult =
        await this.requestTypeModelRepository.findRequestTypeById(input.typeId);
      makeSure(!isNil(requestTypeResult), EError.INVALID_REQUEST_TYPE_ID);
    }
  }
}
