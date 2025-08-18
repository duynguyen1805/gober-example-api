import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
// schema
import {
  Province,
  ProvinceDocumentWithCustomId
} from '@app/database/schemas/province.schema';
import { ProvinceDocument } from '@app/database/schemas/province.schema';

@Injectable()
export class ProvinceModelRepository {
  constructor(
    @InjectModel(Province.name)
    private readonly provinceModelRepository: Model<ProvinceDocumentWithCustomId>
  ) {}

  /**
   * Tìm province theo provinceId (_id trong Mongo)
   * @param provinceId - ObjectId dạng string
   * @returns ProvinceDocument hoặc null
   */
  async findProvinceById(provinceId: string): Promise<ProvinceDocument | null> {
    return this.provinceModelRepository.findById(provinceId).exec();
  }
}
