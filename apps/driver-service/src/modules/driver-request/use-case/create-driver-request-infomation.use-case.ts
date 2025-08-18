import { Inject, Injectable } from '@nestjs/common';
import { isNil } from 'lodash';
import { ClientProxy } from '@nestjs/microservices';
// helpers
import { makeSure, mustExist } from '@app/common/helpers/index';
import { EError } from '@app/common/enums/error.enum';
import { ERequestStatus } from '@app/common/enums/request.enum';
// dto
import { CreateDriverRequestDto } from '../../../../../../libs/common/src/dto/driver-request/create-driver-request.dto';
// model.repository
import { DriverRequestModelRepository } from '../driver-request.model.repository';
import { RequestTypeModelRepository } from '../../../modules/request-type/request-type.model.repository';
// schema
import { DriverRequestDocumentWithCustomId } from '@app/database/schemas/driver-request.schema';

@Injectable()
export class CreateDriverInfomationUseCase {
  constructor(
    private readonly driverRequestModelRepository: DriverRequestModelRepository,
    private readonly requestTypeModelRepository: RequestTypeModelRepository,
    @Inject('FILE_SERVICE') private fileServiceClient: ClientProxy
  ) {}

  /**
   * Tạo thông tin driver request - status mặc định = Pending
   *
   * @param driverId - id chỉ định driver cần cập nhật thông tin, lấy từ token
   * @param input - Thông tin cần cập nhật
   * @returns Thông tin driver sau khi cập nhật
   * @throws EError trả lỗi nếu validate thất bại hoặc cập nhật không thành công
   */

  async execute(
    driverId: string,
    input: CreateDriverRequestDto
  ): Promise<DriverRequestDocumentWithCustomId> {
    // validate input
    await this.validateCreateDriverRequestInformationDto(input);

    // tạo driver request
    const driverRequestDocument =
      await this.driverRequestModelRepository.createDriverRequest({
        ...input,
        driverId: driverId,
        status: ERequestStatus.Pending,
        fileIds: input.fileIds
      });
    return await this.driverRequestModelRepository.saveDriverRequest(
      driverRequestDocument
    );
  }

  /**
   * Validate UpdateDriverRequestDto trước khi request tạo thông tin driver request
   * @param driverId - id chỉ định driver cần tạo driver request, lấy từ token
   * @param input - UpdateDriverRequestDto object để validate
   * @throws EError nếu có giá trị không hợp lệ
   */
  async validateCreateDriverRequestInformationDto(
    input: CreateDriverRequestDto
  ): Promise<void> {
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
