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
import { ApiTags } from '@nestjs/swagger';

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

/* Guards */
import { AdminGuard } from '@auth/guards/admin-auth/admin-auth.guard';
import { JwtAuthGuard } from '@auth/guards/jwt-auth/jwt-auth.guard';
import { OwnerOrAdminGuard } from '@auth/guards/owner-or-admin-auth/owner-or-admin-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('Users')
@Controller('user')
/**
 * Controller for managing user-related operations.
 * Implements the IBaseController interface for User entity.
 */
export class UserController
  implements IBaseController<User, CreateUserDto, UpdateUserDto>
{
  constructor(private userService: UserService) {}
  /**
   * Counts all users in the system.
   * @returns The total number of users.
   */
  @UseGuards(AdminGuard)
  @Get('count-all')
  countAll() {
    return this.userService.countAll();
  }

  /**
   * Counts specific users based on certain criteria.
   * @returns The count of users matching the criteria.
   */
  @UseGuards(AdminGuard)
  @Get('count')
  count() {
    return this.userService.count();
  }

  /**
   * Retrieves all users from the system.
   * @returns An array of all users.
   */
  @UseGuards(AdminGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  /**
   * Retrieves all active users from the system.
   * @returns An array of active users.
   */
  @UseGuards(AdminGuard)
  @Get('actives')
  findAllActives() {
    return this.userService.findAllActives();
  }

  /**
   * Retrieves a single user by their ID.
   * @param id - The ID of the user to retrieve.
   * @returns The user with the specified ID.
   */
  @UseGuards(OwnerOrAdminGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: User['id']) {
    return this.userService.findOne(+id);
  }

  /**
   * Retrieves a single user by their email.
   * @param email - The email of the user to retrieve.
   * @returns The user with the specified email.
   */
  @UseGuards(AdminGuard)
  @Get('email/:email')
  findOneByEmail(@Param('email') email: string) {
    return this.userService.findOneByEmail(email);
  }

  /**
   * Creates a new user in the system.
   * @param payload - The data for the new user.
   * @returns The created user.
   */
  @UseGuards(AdminGuard)
  @Post()
  create(@Body() payload: CreateUserDto) {
    return this.userService.create(payload);
  }

  /**
   * Updates an existing user by their ID.
   * @param id - The ID of the user to update.
   * @param changes - The changes to apply to the user.
   * @returns The updated user.
   */
  @UseGuards(OwnerOrAdminGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() changes: UpdateUserDto,
  ) {
    return this.userService.update(id, changes);
  }

  /**
   * Updates the password of a user by their ID.
   * @param id - The ID of the user whose password is to be updated.
   * @param changes - The new password data.
   * @returns The updated user with the new password.
   */
  @UseGuards(OwnerOrAdminGuard)
  @Patch('password/:id')
  updatePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() changes: UpdatePasswordDto,
  ) {
    return this.userService.updatePassword(id, changes);
  }

  /**
   * Removes a user from the system by their ID.
   * @param id - The ID of the user to remove.
   * @returns A confirmation of the removal operation.
   */
  @UseGuards(AdminGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
