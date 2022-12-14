import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CreateJWTTokensUseCase {
  constructor(
    private readonly configServie: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async execute(payload: any) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configServie.get<string>('AT_SECRET'),
        expiresIn: 100,
      }),

      this.jwtService.signAsync(payload, {
        secret: this.configServie.get<string>('RT_SECRET'),
        expiresIn: 6000,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
