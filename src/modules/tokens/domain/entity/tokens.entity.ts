import { Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({ name: 'bad-tokens' })
export class BadTokens {
  constructor(token?: string) {
    this.token = token;
  }
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string;
}