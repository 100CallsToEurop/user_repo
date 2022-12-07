import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserInputModel } from '../../../modules/users/api/model/user.model';
import { AuthService } from '../application/auth.service';
import { Request, Response } from 'express';
import { RegistrationViewModel } from '../application/dto/registration-view-model';
import { LoginInputModel } from './model/login.model';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  async registration(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: UserInputModel,
  ): Promise<Omit<RegistrationViewModel, 'refreshToken'>> {
    const tokens = await this.authService.registration(dto);
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
    const tokens = await this.authService.login(dto);
    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 4000 * 1000,
      httpOnly: true,
      //secure: true,
    });
    return {
      accessToken: tokens.accessToken,
    };
  }

  @Post('refresh-token')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies.refreshToken;
    const tokens = await this.authService.refresh(token);
    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 4000 * 1000,
      httpOnly: true,
      //secure: true,
    });
    return {
      accessToken: tokens.accessToken,
    };
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies.refreshToken;
    await this.authService.logout(token);
    res.clearCookie('refreshToken');
  }
}
