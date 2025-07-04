// src/infrastructure/auth/strategies/local.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException,ForbiddenException,Inject} from '@nestjs/common';
import { Strategy } from 'passport-local';
import { MobileValidateUserUseCase } from 'src/application/use-cases/moblie_auth/validate-user.use-case';
import { errorResponse } from "src/shared/helpers/response.helper";
import {
    MOBILE_AUTH_REPOSITORY,
    MobileAuthRepositoryInterface,
  } from 'src/domain/repositories/mobile_auth.repository';
  
@Injectable()
export class MobileLocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly validateUser: MobileValidateUserUseCase,

  @Inject(MOBILE_AUTH_REPOSITORY)
  private readonly mobileAuthRepo: MobileAuthRepositoryInterface,
  ) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string) {
    const pending = await this.mobileAuthRepo.findTempUserByEmail(email);
    if (pending) {
      throw new ForbiddenException(
        errorResponse('الحساب غير مفعل. يرجى التحقق من بريدك الإلكتروني.', 403),
      );
    }

    const user = await this.validateUser.execute(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
