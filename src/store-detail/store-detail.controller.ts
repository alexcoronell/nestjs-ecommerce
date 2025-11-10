import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Req,
} from '@nestjs/common';

/* Services */
import { StoreDetailService } from './store-detail.service';

/* Entities */
import { StoreDetail } from './entities/store-detail.entity';
import { AuthRequest } from '@auth/interfaces/auth-request.interface';

/* DTO's */
import { UpdateStoreDetailDto } from './dto/update-store-detail.dto';

import { Result } from '@commons/types/result.type';

@Controller('store-detail')
export class StoreDetailController {
  constructor(private readonly storeDetailService: StoreDetailService) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Result<StoreDetail>> {
    return this.storeDetailService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthRequest,
    @Body() payload: UpdateStoreDetailDto,
  ): Promise<Result<StoreDetail>> {
    const userId = req.user;
    return this.storeDetailService.update(+id, userId, payload);
  }
}
