/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

/* Interfaces */
import { IBaseService } from '@commons/interfaces/i-base-service';

/* Entities */
import { User } from '@user/entities/user.entity';

/* DTO's */
import { CreateUserDto } from '@user/dto/create-user.dto';
import { UpdateUserDto } from '@user/dto/update-user.dto';
import { UpdatePasswordDto } from '@user/dto/update-password-user';

/* Types */
import { Result } from '@commons/types/result.type';

@Injectable()
export class UserService
  implements IBaseService<User, CreateUserDto, UpdateUserDto>
{
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async countAll() {
    const total = await this.userRepo.count();
    return { statusCode: HttpStatus.OK, total };
  }

  async count() {
    const total = await this.userRepo.count({
      where: {
        isDeleted: false,
      },
    });
    return { statusCode: HttpStatus.OK, total };
  }

  /* Find All */
  async findAll() {
    const [users, total] = await this.userRepo.findAndCount({
      where: {
        isDeleted: false,
      },
      order: {
        email: 'ASC',
      },
    });
    const rta = users.map((user) => {
      user.password = undefined;
      return user;
    });

    return {
      statusCode: HttpStatus.OK,
      data: rta,
      total,
    };
  }

  /* Find All  Active Users*/
  async findAllActives(): Promise<Result<User[]>> {
    const [users, total] = await this.userRepo.findAndCount({
      where: {
        isDeleted: false,
        isActive: true,
      },
      order: {
        email: 'ASC',
      },
    });
    const rta = users.map((user) => {
      user.password = undefined;
      return user;
    });
    return {
      statusCode: HttpStatus.OK,
      data: rta,
      total,
    };
  }

  /* Find One - Correct Type Id */
  async findOne(id: User['id']): Promise<Result<User>> {
    const user = await this.userRepo.findOne({
      relations: ['createdBy', 'updatedBy'],
      where: { id, isDeleted: false },
    });
    if (!user) {
      throw new NotFoundException(`The User with id: ${id} not found`);
    }
    user.password = undefined;
    return {
      statusCode: HttpStatus.OK,
      data: user,
    };
  }

  /* Find By Username */
  async findOneByEmail(email: string): Promise<Result<User>> {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`The User with email ${email} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      data: user,
    };
  }

  /* Create */
  async create(dto: CreateUserDto) {
    const newUser = this.userRepo.create(dto);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const hashPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashPassword;
    const user = await this.userRepo.save(newUser);
    user.password = '';
    return {
      statusCode: HttpStatus.CREATED,
      data: user,
      message: 'The user was created',
    };
  }

  /* Update  */
  async update(id: number, changes: UpdateUserDto) {
    const { data } = await this.findOne(id);
    this.userRepo.merge(data as User, changes);
    const rta = await this.userRepo.save(data as User);
    rta.password = '';
    return {
      statusCode: HttpStatus.OK,
      data: rta,
      message: `The User with id: ${id} has been modified`,
    };
  }

  /* Update Password */
  async updatePassword(id: number, changes: UpdatePasswordDto) {
    const { data } = await this.findOne(id);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const hashPassword = await bcrypt.hash(changes.password, 10);
    const newPasswordChanges = {
      password: hashPassword,
    };
    this.userRepo.merge(data as User, newPasswordChanges);
    const rta = await this.userRepo.save(data as User);
    rta.password = '';
    return {
      statusCode: HttpStatus.OK,
      message: 'The password was updated',
    };
  }

  /* Remove */
  async remove(id: User['id']) {
    const { data } = await this.findOne(id);

    const changes = { isDeleted: true };
    this.userRepo.merge(data as User, changes);
    await this.userRepo.save(data as User);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: `The User with id: ${id} has been deleted`,
    };
  }
}
