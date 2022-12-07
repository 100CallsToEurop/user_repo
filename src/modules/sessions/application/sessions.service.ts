import { Injectable } from '@nestjs/common';
import { SessionsEntity } from '../domain/entity/session.entity';
import { SessionsRepository } from '../infrastructure/sessions.repository';

@Injectable()
export class SessionsService {
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  buildResponseSessionEntity(session?: SessionsEntity): string | null {
    return session.token || null;
  }

  async saveUsedToken(token: string) {
    const newBadToken = new SessionsEntity();
    newBadToken.token = token;
    await this.sessionsRepository.saveUsedToken(newBadToken);
  }

  async checkUsedToken(token: string): Promise<string | null> {
    const tokenResponse = await this.sessionsRepository.checkUsedToken(token);
    return this.buildResponseSessionEntity(tokenResponse);
  }
}
