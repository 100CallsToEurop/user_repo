import { Injectable } from "@nestjs/common";
import { BadTokens } from "../domain/entity/tokens.entity";
import { TokensRepository } from "../infrastructure/repository/tokens.repository";

@Injectable()
export class TokenQueryRepository {
  constructor(private readonly tokensRepository: TokensRepository) {}

  async findBadToken(token: string): Promise<BadTokens> {
    return await this.tokensRepository.findBadTokenByToken(token);
  }
}