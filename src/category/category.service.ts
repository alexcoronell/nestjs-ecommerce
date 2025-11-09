import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Interfaces */
import { IBaseService } from '@commons/interfaces/i-base-service';
import { AuthRequest } from '@auth/interfaces/auth-request.interface';

/* Entities */
import { Category } from './entities/category.entity';

/* DTO's */
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

/* Types */
import { Result } from '@commons/types/result.type';
/**
 * Service for managing categories in the application.
 * Implements the IBaseService interface for CRUD operations.
 */
@Injectable()
export class CategoryService
  implements IBaseService<Category, CreateCategoryDto, UpdateCategoryDto>
{
  /**
   * Constructor for the CategoryService.
   * @param repo - Injected TypeORM repository for the Category entity.
   */
  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
  ) {}

  /**
   * Counts all categories, including deleted ones.
   * @returns An object containing the total count of categories and an HTTP status code.
   */
  async countAll() {
    const total = await this.repo.count();
    return { statusCode: HttpStatus.OK, total };
  }

  /**
   * Counts all categories that are not marked as deleted.
   * @returns An object containing the total count of non-deleted categories and an HTTP status code.
   */
  async count() {
    const total = await this.repo.count({
      where: {
        isDeleted: false,
      },
    });
    return { statusCode: HttpStatus.OK, total };
  }

  /**
   * Retrieves all categories that are not marked as deleted.
   * @returns An object containing the list of categories, total count, and an HTTP status code.
   */
  async findAll() {
    const [categories, total] = await this.repo.findAndCount({
      where: {
        isDeleted: false,
      },
      order: {
        name: 'ASC',
      },
    });

    return {
      statusCode: HttpStatus.OK,
      data: categories,
      total,
    };
  }

  /**
   * Retrieves all categories that are not marked as deleted.
   * @returns An object containing the list of categories with relations, total count, and an HTTP status code.
   */
  async findAllWithRelations() {
    const [categories, total] = await this.repo.findAndCount({
      relations: ['createdBy, updatedBy'],
      where: {
        isDeleted: false,
      },
      order: {
        name: 'ASC',
      },
    });

    return {
      statusCode: HttpStatus.OK,
      data: categories,
      total,
    };
  }

  /**
   * Finds a single category by its ID.
   * @param id - The ID of the category to retrieve.
   * @returns A Result object containing the category data and an HTTP status code.
   * @throws NotFoundException if the category is not found.
   */
  async findOne(id: Category['id']): Promise<Result<Category>> {
    const category = await this.repo.findOne({
      relations: ['createdBy', 'updatedBy'],
      where: { id, isDeleted: false },
    });
    if (!category) {
      throw new NotFoundException(`The Category with ID: ${id} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      data: category,
    };
  }

  /**
   * Finds a single category by its name.
   * @param name - The name of the category to retrieve.
   * @returns A Result object containing the category data and an HTTP status code.
   * @throws NotFoundException if the category is not found.
   */
  async findOneByName(name: string): Promise<Result<Category>> {
    const category = await this.repo.findOne({
      relations: ['createdBy', 'updatedBy'],
      where: { name, isDeleted: false },
    });
    if (!category) {
      throw new NotFoundException(`The Category with NAME: ${name} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      data: category,
    };
  }

  /**
   * Finds a single category by its slug.
   * @param slug - The slug of the category to retrieve.
   * @returns A Result object containing the category data and an HTTP status code.
   * @throws NotFoundException if the category is not found.
   */
  async findOneBySlug(slug: string): Promise<Result<Category>> {
    const category = await this.repo.findOne({
      relations: ['createdBy', 'updatedBy'],
      where: { slug, isDeleted: false },
    });
    if (!category) {
      throw new NotFoundException(`The Category with SLUG: ${slug} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      data: category,
    };
  }

  /**
   * Creates a new category.
   * @param dto - The data transfer object containing the category details.
   * @returns An object containing the created category, an HTTP status code, and a success message.
   */
  async create(dto: CreateCategoryDto, userId: AuthRequest['user']) {
    const newCategory = this.repo.create({
      ...dto,
      createdBy: { id: userId },
    });
    const category = await this.repo.save(newCategory);
    return {
      statusCode: HttpStatus.CREATED,
      data: category,
      message: 'The category was created',
    };
  }

  /**
   * Updates an existing category by its ID.
   * @param id - The ID of the category to update.
   * @param changes - The data transfer object containing the updated category details.
   * @returns An object containing the updated category, an HTTP status code, and a success message.
   */
  async update(
    id: number,
    userId: AuthRequest['user'],
    changes: UpdateCategoryDto,
  ) {
    const { data } = await this.findOne(id);
    this.repo.merge(data as Category, {
      ...changes,
      updatedBy: { id: userId },
    });
    const rta = await this.repo.save(data as Category);
    return {
      statusCode: HttpStatus.OK,
      data: rta,
      message: `The Category with ID: ${id} has been modified`,
    };
  }

  /**
   * Marks a category as deleted by its ID.
   * @param id - The ID of the category to delete.
   * @returns An object containing an HTTP status code and a success message.
   */
  async remove(id: Category['id'], userId: AuthRequest['user']) {
    const { data } = await this.findOne(id);
    const changes = { isDeleted: true, deletedBy: { id: userId } };
    this.repo.merge(data as Category, changes);
    await this.repo.save(data as Category);
    return {
      statusCode: HttpStatus.OK,
      message: `The Category with ID: ${id} has been deleted`,
    };
  }
}
