import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

/* Controllets */
import { UsersController } from '@users/controllers/users/users.controller';

/* Services */
import { UsersService } from '@users/services/users/users.service';

/* Entities */
import { User } from '@users/entities/user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
