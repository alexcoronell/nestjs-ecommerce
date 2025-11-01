/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PayloadToken } from '@auth/interfaces/token.interface';
import { UserRoleEnum } from '@commons/enums/user-role.enum';

@Injectable()
export class IsNotCustomerGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as PayloadToken;
    if (!user || user.role === UserRoleEnum.CUSTOMER) {
      throw new UnauthorizedException('Unauthorized: Customer access denied');
    }

    return true;
  }
}
