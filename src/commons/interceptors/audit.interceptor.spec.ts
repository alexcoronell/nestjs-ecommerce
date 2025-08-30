/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { Reflector } from '@nestjs/core';

import { AuditInterceptor } from './audit.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { PayloadToken } from '@auth/interfaces/token.interface';

describe('AuditInterceptor', () => {
  let interceptor: AuditInterceptor;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditInterceptor,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    interceptor = module.get<AuditInterceptor>(AuditInterceptor);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should add createdBy in POST request', () => {
    const userId = 1;
    const request = {
      method: 'POST',
      body: {} as any,
      user: { user: userId, isAdmin: true } as PayloadToken,
    };

    const context: ExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
      getHandler: () => {},
      getClass: () => {},
    } as any;

    const next: CallHandler = {
      handle: () => of(null),
    };

    jest.spyOn(reflector, 'get').mockReturnValue(false);

    interceptor.intercept(context, next);
    expect(request.body.createdBy).toBe(userId);
    expect(request.body.updatedBy).toBe(userId);
  });

  it('should add updatedBy in PATCH request', () => {
    const userId = 1;
    const request = {
      method: 'PATCH',
      body: {} as any,
      user: { user: userId, isAdmin: true },
    };

    const context: ExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
      getHandler: () => {},
      getClass: () => {},
    } as any;

    const next: CallHandler = {
      handle: () => of(null),
    };

    jest.spyOn(reflector, 'get').mockReturnValue(false);

    interceptor.intercept(context, next);
    expect(request.body.updatedBy).toBe(userId);
  });

  it('should add updatedBy in PUT request', () => {
    const userId = 1;
    const request = {
      method: 'PUT',
      body: {} as any,
      user: { user: userId, isAdmin: true },
    };

    const context: ExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
      getHandler: () => {},
      getClass: () => {},
    } as any;

    const next: CallHandler = {
      handle: () => of(null),
    };

    jest.spyOn(reflector, 'get').mockReturnValue(false);

    interceptor.intercept(context, next);
    expect(request.body.updatedBy).toBe(userId);
  });

  it('should add deletedBy in DELETE request', () => {
    const userId = 1;
    const request = {
      method: 'DELETE',
      body: {} as any,
      user: { user: userId, isAdmin: true },
    };

    const context: ExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
      getHandler: () => {},
      getClass: () => {},
    } as any;

    const next: CallHandler = {
      handle: () => of(null),
    };

    interceptor.intercept(context, next);
    expect(request.body.deletedBy).toBe(userId);
  });

  it('should not update the body if the route is "public"', () => {
    const request = {
      method: 'POST',
      body: {} as any,
      user: { user: 1, isAdmin: true },
    };

    const context: ExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
      getHandler: () => {},
      getClass: () => {},
    } as any;

    const next: CallHandler = {
      handle: () => of(null),
    };

    // ✅ Simula que el decorador @NoAudit() está presente
    jest.spyOn(reflector, 'get').mockReturnValue(true);

    interceptor.intercept(context, next);
    expect(request.body.createdBy).toBeUndefined();
  });
});
