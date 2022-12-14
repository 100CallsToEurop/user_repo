import { Injectable } from "@nestjs/common";
import { BadTokens } from "../../domain/entity/tokens.entity";
import { TokensRepository } from "../../infrastructure/repository/tokens.repository";

@Injectable()
export class AddBadTokenUseCase {
  constructor(private readonly tokensRepository: TokensRepository) {}
  async execute(token: string): Promise<void> {
    const newBadToken = new BadTokens(token);
    await this.tokensRepository.addBadToken(newBadToken);
  }
}