import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
// module.repository
import {
  RequestType,
  RequestTypeDocumentWithCustomId
} from '@app/database/schemas/request-type.schema';
import { RequestTypeDocument } from '@app/database/schemas/request-type.schema';

@Injectable()
export class RequestTypeModelRepository {
  constructor(
    @InjectModel(RequestType.name)
    private readonly requestTypeModelRepository: Model<RequestTypeDocumentWithCustomId>
  ) {}

  /**
   * Tìm request type theo requestTypeId (_id trong Mongo)
   * @param requestTypeId - ObjectId dạng string
   * @returns RequestTypeDocument hoặc null
   */
  async findRequestTypeById(
    requestTypeId: string
  ): Promise<RequestTypeDocument | null> {
    return this.requestTypeModelRepository.findById(requestTypeId).exec();
  }
}
