import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriverEntity } from '../../database/entities/driver.entity';
import { CreateDriverDto } from './dto/create-driver.dto';
import { QueryDriverDto } from './dto/query-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { PagedDriverResult } from './interfaces/driver.interface';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(DriverEntity)
    private readonly driverRepository: Repository<DriverEntity>
  ) {}

  async createDriver(input: CreateDriverDto): Promise<DriverEntity> {
    const entityDriver = this.driverRepository.create({
      fullName: input.fullName,
      phoneNumber: input.phoneNumber,
      email: input.email,
      deviceToken: input.deviceToken,
      avatar:
        typeof input.avatar === 'string'
          ? parseInt(input.avatar)
          : input.avatar,
      activeAreaId: input.activeAreaId,
      temporaryAddress: input.temporaryAddress
    });
    return this.driverRepository.save(entityDriver);
  }

  async getListDriver(
    query: QueryDriverDto
  ): Promise<PagedDriverResult<DriverEntity>> {
    const { page = 1, pageSize = 20, keyword, status, activeAreaId } = query;
    const queryDB = this.driverRepository.createQueryBuilder('driver');

    if (keyword) {
      queryDB.andWhere(
        '(driver.full_name ILIKE :kw OR driver.phone_number ILIKE :kw OR driver.email ILIKE :kw)',
        { kw: `%${keyword}%` }
      );
    }
    if (status) {
      queryDB.andWhere('driver.status = :status', { status });
    }
    if (activeAreaId) {
      queryDB.andWhere('driver.active_area_id = :activeAreaId', {
        activeAreaId
      });
    }

    queryDB
      .orderBy('driver.created_at', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [items, total] = await queryDB.getManyAndCount();
    return { items, total, page, pageSize };
  }

  async findDriverById(driverId: number): Promise<DriverEntity | null> {
    return this.driverRepository.findOne({ where: { driverId } });
  }

  async findDriverByIdWithFiles(
    driverId: number
  ): Promise<DriverEntity | null> {
    return this.driverRepository.findOne({
      where: { driverId },
      relations: ['identityCardFront', 'identityCardBack', 'avatarFile']
    });
  }

  async updateDriverInformation(
    driverId: number,
    input: UpdateDriverDto
  ): Promise<DriverEntity> {
    const entity = await this.findDriverById(driverId);
    if (!entity) throw new NotFoundException('Driver not found');
    Object.assign(entity, input);
    return this.driverRepository.save(entity);
  }

  async removeDriver(driverId: number): Promise<void> {
    await this.driverRepository.delete({ driverId });
  }
}
