import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
/**
 * Controller responsible for handling category-related operations.
 * Provides endpoints for creating, retrieving, updating, and deleting categories.
 */
export class CategoryController {
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
   * Retrieves a single category by its ID.
   *
   * @param id - The ID of the category to retrieve.
   * @returns The category with the specified ID.
   */
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
  @Get('name/:name')
  findOneByname(@Param('name') name: string) {
    return this.categoryService.findOneByName(name);
  }

  /**
   * Creates a new category.
   *
   * @param payload - The data transfer object containing the details of the category to create.
   * @returns The newly created category.
   */
  @Post()
  create(@Body() payload: CreateCategoryDto) {
    return this.categoryService.create(payload);
  }

  /**
   * Updates an existing category by its ID.
   *
   * @param id - The ID of the category to update.
   * @param updateCategoryDto - The data transfer object containing the updated details of the category.
   * @returns The updated category.
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  /**
   * Deletes a category by its ID.
   *
   * @param id - The ID of the category to delete.
   * @returns A confirmation message or status indicating the deletion result.
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(+id);
  }
}
