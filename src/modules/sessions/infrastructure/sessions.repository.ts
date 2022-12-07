import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SessionsEntity } from "../domain/entity/session.entity";

@Injectable()
export class SessionsRepository {
  constructor(
    @InjectRepository(SessionsEntity)
    private readonly sessionsRepository: Repository<SessionsEntity>,
  ) {}

  async saveUsedToken(tokenEntity: SessionsEntity) {
    await this.sessionsRepository.save(tokenEntity);
  }

  async checkUsedToken(token: string): Promise<SessionsEntity> {
    return this.sessionsRepository.findOneBy({ token });
  }
}