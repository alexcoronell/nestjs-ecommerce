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

/* Interface */
import { IBaseController } from '@commons/interfaces/i-base-controller';

/* Decorators */
import { UserId } from '@auth/decorators/user-id.decorator';

/* Services */
import { TagService } from './tag.service';

/* Entities */
import { Tag } from './entities/tag.entity';

/* DTO's */
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Controller('tag')
export class TagController
  implements IBaseController<Tag, CreateTagDto, UpdateTagDto>
{
  constructor(private readonly tagService: TagService) {}

  @Get('count-all')
  countAll() {
    return this.tagService.countAll();
  }

  @Get('count')
  count() {
    return this.tagService.count();
  }

  @Get()
  findAll() {
    return this.tagService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.findOne(+id);
  }

  @Get('name/:name')
  findOneByname(@Param('name') name: string) {
    return this.tagService.findOneByName(name);
  }

  @Post()
  create(@Body() payload: CreateTagDto, @UserId() userId: number) {
    return this.tagService.create(payload, userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @UserId() userId: number,
    @Body() updateCategoryDto: UpdateTagDto,
  ) {
    return this.tagService.update(+id, userId, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @UserId() userId: number) {
    return this.tagService.remove(+id, userId);
  }
}
