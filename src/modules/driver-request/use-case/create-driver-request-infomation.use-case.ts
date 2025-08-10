import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  makeSure,
  mustExist
} from '../../../common/helpers/system/server-error.helper';
import { DriverRequestEntity } from '../../../database/entities/driver-request.entity';
import { RequestTypeEntity } from '../../../database/entities/request-type.entity';
import { EError } from '../../../common/enums/error.enum';
import { FileService } from '../../file/file.service';
import { isNil } from 'lodash';
import { CreateDriverRequestDto } from '../dto/create-driver-request.dto';
import { ERequestStatus } from '../../../common/enums';

@Injectable()
export class CreateDriverInfomationUseCase {
  constructor(
    @InjectRepository(DriverRequestEntity)
    private driverRequestRepository: Repository<DriverRequestEntity>,
    @InjectRepository(RequestTypeEntity)
    private requestTypeRepository: Repository<RequestTypeEntity>,
    private readonly fileService: FileService
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
    driverId: number,
    input: CreateDriverRequestDto
  ): Promise<DriverRequestEntity> {
    // validate input
    await this.validateCreateDriverRequestInformationDto(input);

    // load các FileEntity
    let files = [];
    if (input.fileIds && input.fileIds.length > 0) {
      files = await Promise.all(
        input.fileIds.map(async (id) => {
          return this.fileService.findFileById(+id);
        })
      );
    }

    // tạo driver request
    const entityDriverRequest = this.driverRequestRepository.create({
      ...input,
      driverId: driverId,
      status: ERequestStatus.Pending,
      files: files
    });
    return this.driverRequestRepository.save(entityDriverRequest);
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
        makeSure(!isNaN(Number(fileId)), EError.INVALID_FILE_ID);
        const file = await this.fileService.findFileById(+fileId);
        makeSure(!isNil(file), EError.INVALID_FILE_ID);
      }
    }

    // Kiểm tra typeId
    if (input?.typeId) {
      makeSure(!isNaN(Number(input?.typeId)), EError.INVALID_REQUEST_TYPE_ID);
      // Kiểm tra thêm typeId có tồn tại trong bảng RequestType
      const requestTypeResult = await this.requestTypeRepository.findOne({
        where: { requestTypeId: +input?.typeId }
      });
      makeSure(!isNil(requestTypeResult), EError.INVALID_REQUEST_TYPE_ID);
    }
  }
}
