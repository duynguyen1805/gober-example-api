import { Injectable } from '@nestjs/common';
import { isNil } from 'lodash';
// helpers
import {
  makeSure,
  mustExist
} from '../../../common/helpers/server-error.helper';
import { EError } from '../../../common/enums/error.enum';
import { ERequestStatus } from '../../../common/enums';
// dto
import { UpdateDriverRequestDto } from '../dto/update-driver-request.dto';
// service
import { FileService } from '../../file/file.service';

// schema
import { DriverRequestDocumentWithCustomId } from '../../../database/mongo-db/driver-request.schema';
// model.repository
import { DriverRequestModelRepository } from '../driver-request.model.repository';

import { RequestTypeModelRepository } from '../../../modules/request-type/request-type.model.repository';

@Injectable()
export class UpdateDriverRequestInfomationUseCase {
  private driverRequestExists: DriverRequestDocumentWithCustomId;
  constructor(
    private readonly driverRequestModelRepository: DriverRequestModelRepository,
    private readonly requestTypeModelRepository: RequestTypeModelRepository,
    private readonly fileService: FileService
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
    input: UpdateDriverRequestDto
  ): Promise<DriverRequestDocumentWithCustomId> {
    // validate input
    await this.validateUpdateDriverInformationDto(driverId, input);

    // load file document
    if (input.fileIds && input.fileIds.length > 0) {
      const files = await Promise.all(
        input.fileIds.map(async (id) => {
          return this.fileService.findFileById(id);
        })
      );
      this.driverRequestExists.toObject().fileIds = files;
    }

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
    input: UpdateDriverRequestDto
  ): Promise<void> {
    // Kiểm tra driverRequestId
    if (input?.driverRequestId) {
      makeSure(
        !isNaN(Number(input?.driverRequestId)),
        EError.INVALID_DRIVER_REQUEST_ID
      );
    }

    // Kiểm tra driver đã tồn tại, và còn ở trạng thái Pending
    this.driverRequestExists =
      await this.driverRequestModelRepository.findDriverRequestByFilter({
        where: { driverId: driverId, driverRequestId: input.driverRequestId }
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
        makeSure(!isNaN(Number(fileId)), EError.INVALID_FILE_ID);
        const file = await this.fileService.findFileById(fileId);
        makeSure(!isNil(file), EError.INVALID_FILE_ID);
      }
    }

    // Kiểm tra typeId
    if (input?.typeId) {
      makeSure(!isNaN(Number(input?.typeId)), EError.INVALID_REQUEST_TYPE_ID);
      // Kiểm tra thêm typeId có tồn tại trong bảng RequestType
      const requestTypeResult =
        await this.requestTypeModelRepository.findRequestTypeById(input.typeId);
      makeSure(!isNil(requestTypeResult), EError.INVALID_REQUEST_TYPE_ID);
    }
  }
}
