import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class DecodeJWTTokenUseCase {
  constructor(
    private readonly configServie: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async execute(token: string) {
    try {
      const decodeToken = this.jwtService.verify(token, {
        secret: this.configServie.get<string>('RT_SECRET'),
      });
      return decodeToken;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
