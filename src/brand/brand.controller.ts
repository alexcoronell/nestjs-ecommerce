import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

/* Interface */
import { IBaseController } from '@commons/interfaces/i-base-controller';

/* Services */
import { BrandService } from '@brand/brand.service';

/* Entities */
import { Brand } from './entities/brand.entity';

/* DTO's */
import { CreateBrandDto } from '@brand/dto/create-brand.dto';
import { UpdateBrandDto } from '@brand/dto/update-brand.dto';

/* Guards */
import { AdminGuard } from '@auth/guards/admin-auth/admin-auth.guard';
import { JwtAuthGuard } from '@auth/guards/jwt-auth/jwt-auth.guard';

@Controller('brand')
/**
 * Controller for managing brand-related operations.
 * Implements the IBaseController interface to handle basic CRUD operations.
 *
 * @remarks
 * This controller exposes endpoints to count, list, create, update, and delete brands,
 * as well as to search brands by ID or name.
 */
export class BrandController
  implements IBaseController<Brand, CreateBrandDto, UpdateBrandDto>
{
  /**
   * Injects the brand service to handle business logic.
   * @param brandService Service responsible for brand management.
   */
  constructor(private readonly brandService: BrandService) {}

  /**
   * Gets the total count of all brands, including logically deleted ones if applicable.
   * @returns Total number of brands.
   */
  @UseGuards(JwtAuthGuard)
  @Get('count-all')
  countAll() {
    return this.brandService.countAll();
  }

  /**
   * Gets the count of active brands.
   * @returns Number of active brands.
   */
  @UseGuards(JwtAuthGuard)
  @Get('count')
  count() {
    return this.brandService.count();
  }

  /**
   * Retrieves the list of all brands.
   * @returns Array of Brand objects.
   */
  @Get()
  findAll() {
    return this.brandService.findAll();
  }

  /**
   * Finds a brand by its unique identifier.
   * @param id Numeric identifier of the brand.
   * @returns Brand object corresponding to the provided ID.
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.brandService.findOne(+id);
  }

  /**
   * Finds a brand by its name.
   * @param name Name of the brand to search for.
   * @returns Brand object corresponding to the provided name.
   */
  @UseGuards(JwtAuthGuard)
  @Get('name/:name')
  findOneByname(@Param('name') name: string) {
    return this.brandService.findOneByName(name);
  }

  /**
   * Creates a new brand with the provided data.
   * @param payload Data required to create a new brand.
   * @returns Created Brand object.
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  create(@Body() payload: CreateBrandDto) {
    return this.brandService.create(payload);
  }

  /**
   * Updates an existing brand with the provided data.
   * @param id Identifier of the brand to update.
   * @param updateCategoryDto Data to update the brand.
   * @returns Updated Brand object.
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateBrandDto,
  ) {
    return this.brandService.update(+id, updateCategoryDto);
  }

  /**
   * Deletes a brand by its identifier.
   * @param id Identifier of the brand to delete.
   * @returns Result of the delete operation.
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.brandService.remove(+id);
  }
}
