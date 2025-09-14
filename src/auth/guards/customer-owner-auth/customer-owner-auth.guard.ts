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

@Injectable()
export class CustomerOwnerGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as PayloadToken;
    const { id } = request.params;

    if (!user || (user.user !== +id && user.isCustomer === true)) {
      throw new UnauthorizedException('Different Customer');
    }
    return true;
  }
}
