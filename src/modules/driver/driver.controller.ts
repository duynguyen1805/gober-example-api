import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { DriverEntity } from '../../database/entities/driver.entity';
import { QueryDriverDto } from './dto/query-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@ApiTags('drivers')
@Controller('drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new driver',
    description:
      'Creates a driver with required fields and returns the created entity.'
  })
  @ApiBody({ type: CreateDriverDto, description: 'Payload to create driver' })
  @ApiCreatedResponse({
    description: 'Driver created',
    type: DriverEntity,
    schema: {
      example: {
        driverId: 1,
        fullName: 'Nguyen Van A',
        phoneNumber: '+84901234567',
        email: 'driver@example.com',
        avatar: '123',
        activeAreaId: 1,
        temporaryAddress: 'HCMC',
        isActive: true,
        createdAt: '2025-08-08T00:00:00.000Z',
        updatedAt: '2025-08-08T00:00:00.000Z'
      }
    }
  })
  @ApiBadRequestResponse({ description: 'Validation error' })
  async createDriver(@Body() body: CreateDriverDto): Promise<DriverEntity> {
    return this.driverService.createDriver(body);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List drivers',
    description: 'List drivers with pagination and filters.'
  })
  @ApiOkResponse({
    description: 'Paged drivers',
    schema: {
      example: {
        items: [
          { driverId: 1, fullName: 'Nguyen Van A', phoneNumber: '+84901234567' }
        ],
        total: 1,
        page: 1,
        pageSize: 20
      }
    }
  })
  async getListDriver(@Query() query: QueryDriverDto) {
    return this.driverService.getListDriver(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get driver by id',
    description: 'Fetch a driver by driverId.'
  })
  @ApiParam({ name: 'id', required: true, example: 1 })
  @ApiOkResponse({ description: 'Driver found', type: DriverEntity })
  async findDriverById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<DriverEntity | null> {
    return this.driverService.findDriverById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update driver',
    description: 'Update a driver by driverId.'
  })
  @ApiParam({ name: 'id', required: true, example: 1 })
  @ApiBody({ type: UpdateDriverDto })
  @ApiOkResponse({ description: 'Driver updated', type: DriverEntity })
  async updateDriverInformation(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateDriverDto
  ): Promise<DriverEntity> {
    return this.driverService.updateDriverInformation(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete driver',
    description: 'Delete a driver by driverId.'
  })
  @ApiParam({ name: 'id', required: true, example: 1 })
  async removeDriver(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.driverService.removeDriver(id);
  }
}
