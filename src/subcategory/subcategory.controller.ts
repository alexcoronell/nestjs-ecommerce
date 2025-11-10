import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Req,
} from '@nestjs/common';

/* Interface */
import { IBaseController } from '@commons/interfaces/i-base-controller';
import { AuthRequest } from '@auth/interfaces/auth-request.interface';

/* Services */
import { SubcategoryService } from './subcategory.service';

/* Entity */
import { Subcategory } from './entities/subcategory.entity';

/* DTO's */
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';

@Controller('subcategory')
export class SubcategoryController
  implements
    IBaseController<Subcategory, CreateSubcategoryDto, UpdateSubcategoryDto>
{
  constructor(private readonly subcategoryService: SubcategoryService) {}

  @Get('count-all')
  countAll() {
    return this.subcategoryService.countAll();
  }

  @Get('count')
  count() {
    return this.subcategoryService.count();
  }

  @Get()
  findAll() {
    return this.subcategoryService.findAll();
  }

  @Get('category/:category')
  findAllByCategory(@Param('category', ParseIntPipe) category: number) {
    return this.subcategoryService.findAllByCategory(category);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.subcategoryService.findOne(+id);
  }

  @Get('name/:name')
  findOneByname(@Param('name') name: string) {
    return this.subcategoryService.findOneByName(name);
  }

  @Post()
  create(@Body() payload: CreateSubcategoryDto, @Req() req: AuthRequest) {
    const userId = req.user;
    return this.subcategoryService.create(payload, userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthRequest,
    @Body() changes: UpdateSubcategoryDto,
  ) {
    const userId = req.user;
    return this.subcategoryService.update(+id, userId, changes);
  }

  @Delete(':id¨')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: AuthRequest) {
    const userId = req.user;
    return this.subcategoryService.remove(+id, userId);
  }
}
