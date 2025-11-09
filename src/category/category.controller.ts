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
  Req,
} from '@nestjs/common';

/* Interface */
import { IBaseController } from '@commons/interfaces/i-base-controller';
import { AuthRequest } from '@auth/interfaces/auth-request.interface';

/* Services */
import { CategoryService } from './category.service';

/* DTO's */
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

/* Guards */
import { AdminGuard } from '@auth/guards/admin-auth/admin-auth.guard';
import { IsNotCustomerGuard } from '@auth/guards/is-not-customer/is-not-customer.guard';
import { JwtAuthGuard } from '@auth/guards/jwt-auth/jwt-auth.guard';

@Controller('category')
/**
 * Controller responsible for handling category-related operations.
 * Provides endpoints for creating, retrieving, updating, and deleting categories.
 */
export class CategoryController
  implements IBaseController<Category, CreateCategoryDto, UpdateCategoryDto>
{
  /**
   * Constructs a new instance of the CategoryController.
   *
   * @param categoryService - The service used to handle category-related business logic.
   */
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * Retrieves the total count of all categories.
   *
   * @returns The total number of categories in the system.
   */
  @UseGuards(JwtAuthGuard, IsNotCustomerGuard)
  @Get('count-all')
  countAll() {
    return this.categoryService.countAll();
  }

  /**
   * Retrieves the total count of categories.
   * Delegates the counting logic to the CategoryService.
   *
   * @returns The total number of categories.
   */
  @UseGuards(JwtAuthGuard, IsNotCustomerGuard)
  @Get('count')
  count() {
    return this.categoryService.count();
  }

  /**
   * Retrieves a list of all categories.
   *
   * @returns An array of all categories.
   */
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }
  /**
   * Retrieves a list of all categories.
   *
   * @returns An array of all categories with relations.
   */
  @Get('relations')
  findAllWithRelations() {
    return this.categoryService.findAllWithRelations();
  }

  /**
   * Retrieves a single category by its ID.
   *
   * @param id - The ID of the category to retrieve.
   * @returns The category with the specified ID.
   */
  @UseGuards(JwtAuthGuard, IsNotCustomerGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne(+id);
  }

  /**
   * Retrieves a single category by its name.
   *
   * @param name - The name of the category to retrieve.
   * @returns The category with the specified name.
   */
  @UseGuards(JwtAuthGuard, IsNotCustomerGuard)
  @Get('name/:name')
  findOneByName(@Param('name') name: string) {
    return this.categoryService.findOneByName(name);
  }

  /**
   * Retrieves a single category by its slug.
   *
   * @param slug - The slug of the category to retrieve.
   * @returns The category with the specified slug.
   */
  @UseGuards(JwtAuthGuard, IsNotCustomerGuard)
  @Get('slug/:slug')
  findOneBySlug(@Param('slug') slug: string) {
    return this.categoryService.findOneBySlug(slug);
  }

  /**
   * Creates a new category.
   *
   * @param payload - The data transfer object containing the details of the category to create.
   * @returns The newly created category.
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  create(@Body() payload: CreateCategoryDto, @Req() req: AuthRequest) {
    const userId = req.user;
    return this.categoryService.create(payload, userId);
  }

  /**
   * Updates an existing category by its ID.
   *
   * @param id - The ID of the category to update.
   * @param updateCategoryDto - The data transfer object containing the updated details of the category.
   * @returns The updated category.
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthRequest,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const userId = req.user;
    return this.categoryService.update(+id, userId, updateCategoryDto);
  }

  /**
   * Deletes a category by its ID.
   *
   * @param id - The ID of the category to delete.
   * @returns A confirmation message or status indicating the deletion result.
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: AuthRequest) {
    const userId = req.user;
    return this.categoryService.remove(+id, userId);
  }
}
