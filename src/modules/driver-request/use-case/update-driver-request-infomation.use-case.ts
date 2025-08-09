import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  makeSure,
  mustExist
} from '../../../common/helpers/server-error.helper';
import { DriverRequestEntity } from '../../../database/entities/driver-request.entity';
import { RequestTypeEntity } from '../../../database/entities/request-type.entity';
import { EError, EErrorDetail } from '../../../common/enums/auth/auth.enum';
import { UpdateDriverRequestDto } from '../dto/update-driver-request.dto';
import { FileService } from '../../file/file.service';
import { isNil } from 'lodash';

@Injectable()
export class UpdateDriverRequestInfomationUseCase {
  private driverRequestExists: DriverRequestEntity;
  constructor(
    @InjectRepository(DriverRequestEntity)
    private driverRequestRepository: Repository<DriverRequestEntity>,
    @InjectRepository(RequestTypeEntity)
    private requestTypeRepository: Repository<RequestTypeEntity>,
    private readonly fileService: FileService
  ) {}

  /**
   * Thực hiện cập nhật thông tin driver
   *
   * @param driverId - id chỉ định driver cần cập nhật thông tin, lấy từ token
   * @param input - Thông tin cần cập nhật
   * @returns Thông tin driver sau khi cập nhật
   * @throws EError trả lỗi nếu validate thất bại hoặc cập nhật không thành công
   */

  async execute(
    driverId: number,
    input: UpdateDriverRequestDto
  ): Promise<DriverRequestEntity> {
    // validate input
    await this.validateUpdateDriverInformationDto(driverId, input);

    // load FileEntity
    if (input.fileIds && input.fileIds.length > 0) {
      const files = await Promise.all(
        input.fileIds.map(async (id) => {
          return this.fileService.findFileById(+id);
        })
      );
      this.driverRequestExists.files = files;
    }

    Object.assign(this.driverRequestExists, {
      ...input,
      files: this.driverRequestExists.files
    });
    return this.driverRequestRepository.save(this.driverRequestExists);
  }

  /**
   * Validate UpdateDriverRequestDto trước khi request cập nhật thông tin driver
   * @param driverId - id chỉ định driver cần cập nhật thông tin, lấy từ token
   * @param input - UpdateDriverRequestDto object để validate
   * @throws EError nếu có giá trị không hợp lệ
   */
  async validateUpdateDriverInformationDto(
    driverId: number,
    input: UpdateDriverRequestDto
  ): Promise<void> {
    // Kiểm tra driverRequestId
    if (input?.driverRequestId) {
      makeSure(
        !isNaN(Number(input?.driverRequestId)),
        EError.INVALID_DRIVER_REQUEST_ID,
        EErrorDetail.INVALID_DRIVER_REQUEST_ID
      );
    }

    // Kiểm tra driver đã tồn tại
    this.driverRequestExists = await this.driverRequestRepository.findOne({
      where: { driverId: driverId, driverRequestId: input.driverRequestId }
    });
    mustExist(
      this.driverRequestExists,
      EError.DRIVER_NOT_FOUND,
      EErrorDetail.DRIVER_NOT_FOUND
    );

    // Kiểm tra các trường có thông tin trong input
    // Kiểm tra code
    if (input?.code) {
      makeSure(
        input.code.length === 6,
        EError.INVALID_CODE_DRIVER_REQUEST,
        EErrorDetail.INVALID_CODE_DRIVER_REQUEST
      );
    }
    // Kiểm tra description
    if (input?.description) {
      makeSure(
        input.description.length > 0,
        EError.INVALID_DESCRIPTION_DRIVER_REQUEST,
        EErrorDetail.INVALID_DESCRIPTION_DRIVER_REQUEST
      );
    }

    // Kiểm tra fileId
    if (input?.fileIds && input.fileIds.length > 0) {
      for (const fileId of input.fileIds) {
        makeSure(
          !isNaN(Number(fileId)),
          EError.INVALID_FILE_ID,
          EErrorDetail.INVALID_FILE_ID
        );
        const file = await this.fileService.findFileById(+fileId);
        makeSure(
          !isNil(file),
          EError.INVALID_FILE_ID,
          EErrorDetail.INVALID_FILE_ID
        );
      }
    }

    // Kiểm tra typeId
    if (input?.typeId) {
      makeSure(
        !isNaN(Number(input?.typeId)),
        EError.INVALID_REQUEST_TYPE_ID,
        EErrorDetail.INVALID_REQUEST_TYPE_ID
      );
      // Kiểm tra thêm typeId có tồn tại trong bảng RequestType
      const requestTypeResult = await this.requestTypeRepository.findOne({
        where: { typeId: +input?.typeId }
      });
      makeSure(
        !isNil(requestTypeResult),
        EError.INVALID_REQUEST_TYPE_ID,
        EErrorDetail.INVALID_REQUEST_TYPE_ID
      );
    }
  }
}
