import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserInputModel } from '../../../modules/users/api/model/user.model';
import { Request, Response } from 'express';
import { RegistrationViewModel } from '../application/dto/registration-view-model';
import { LoginInputModel } from './model/login.model';
import { AuthQueryRepository } from './queryRepository/auth.query.repository';
import { TokenQueryRepository } from 'src/modules/tokens/queryRepository/token.query.repository';
import { CommandBus } from '@nestjs/cqrs';
import {
  AuthLoginCommand,
  AuthLogoutCommand,
  AuthRefreshCommand,
  AuthRegistrationCommand,
} from '../application/useCases';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authQueryRepository: AuthQueryRepository,
    private readonly tokensQueryRepository: TokenQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @Post('registration')
  async registration(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: UserInputModel,
  ): Promise<Omit<RegistrationViewModel, 'refreshToken'>> {
    const tokens = await this.commandBus.execute(
      new AuthRegistrationCommand(dto),
    );
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
    const user = await this.authQueryRepository.checkCredentails(dto);
    const tokens = await this.commandBus.execute(new AuthLoginCommand(user));
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
    await this.tokensQueryRepository.findBadToken(token);
    const tokens = await this.commandBus.execute(new AuthRefreshCommand(token));
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
    await this.tokensQueryRepository.findBadToken(token);
    await this.commandBus.execute(new AuthLogoutCommand(token));
    res.clearCookie('refreshToken');
  }
}
