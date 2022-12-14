import { Body, Controller, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserInputModel } from '../../../modules/users/api/model/user.model';
import { Request, Response } from 'express';
import { RegistrationViewModel } from '../application/dto/registration-view-model';
import { LoginInputModel } from './model/login.model';
import {
  AuthCheckCredentailsUseCase,
  AuthLoginUseCase,
  AuthLogoutUseCase,
  AuthRefreshUseCase,
  AuthRegistrationUseCase,
} from '../application/useCases';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authLogoutUseCase: AuthLogoutUseCase,
    private readonly authLoginUseCase: AuthLoginUseCase,
    private readonly authRefreshUseCase: AuthRefreshUseCase,
    private readonly authRegistrationUseCase: AuthRegistrationUseCase,
    private readonly authCheckCredentailsUseCase: AuthCheckCredentailsUseCase,
  ) {}

  @Post('registration')
  async registration(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: UserInputModel,
  ): Promise<Omit<RegistrationViewModel, 'refreshToken'>> {
    const tokens = await this.authRegistrationUseCase.execute(dto);
    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 4000 * 1000,
      httpOnly: true,
      //secure: true,
    });
    return {
      accessToken: tokens.accessToken,
    };
  }

  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginInputModel,
  ): Promise<Omit<RegistrationViewModel, 'refreshToken'>> {
    const user = await this.authCheckCredentailsUseCase.execute(dto);
    const tokens = await this.authLoginUseCase.execute(user);
    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 4000 * 1000,
      httpOnly: true,
      //secure: true,
    });
    return {
      accessToken: tokens.accessToken,
    };
  }

  @HttpCode(200)
  @Post('refresh-token')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies.refreshToken;
    const tokens = await this.authRefreshUseCase.execute(token);
    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 4000 * 1000,
      httpOnly: true,
      //secure: true,
    });
    return {
      accessToken: tokens.accessToken,
    };
  }

  @HttpCode(204)
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies.refreshToken;
    await this.authLogoutUseCase.execute(token);
    res.clearCookie('refreshToken');
  }
}
