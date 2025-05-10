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
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

/* Interfaces */
import { IBaseController } from '@commons/interfaces/i-base-controller';

/* Services */
import { UserService } from './user.service';

/* Entities */
import { User } from './entities/user.entity';

/* DTO's */
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password-user';

@ApiTags('Users')
@Controller('user')
export class UserController
  implements IBaseController<User, CreateUserDto, UpdateUserDto>
{
  constructor(private readonly userService: UserService) {}

  @Get('count-all')
  countAll() {
    return this.userService.countAll();
  }

  @Get('count')
  count() {
    return this.userService.count();
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('actives')
  findAlActivesl() {
    return this.userService.findAllActives();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: User['id']) {
    return this.userService.findOne(id);
  }

  @Get('email')
  findOneByEmail(@Param('email') email: string) {
    return this.userService.findOneByEmail(email);
  }

  @Post()
  create(@Body() payload: CreateUserDto) {
    return this.userService.create(payload);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() changes: UpdateUserDto,
  ) {
    return this.userService.update(id, changes);
  }

  @Patch('email/:id')
  updatePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() changes: UpdatePasswordDto,
  ) {
    return this.userService.updatePassword(id, changes);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
