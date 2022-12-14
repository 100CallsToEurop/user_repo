import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BadTokens } from "../../domain/entity/tokens.entity";

@Injectable()
export class TokensRepository {
  constructor(
    @InjectRepository(BadTokens)
    private readonly tokensRepository: Repository<BadTokens>,
  ) {}

  async addBadToken(token: BadTokens): Promise<void> {
    await this.tokensRepository.save(token);
  }

  async findBadTokenByToken(token: string): Promise<BadTokens> {
    return await this.tokensRepository.findOneBy({ token });
  }
}