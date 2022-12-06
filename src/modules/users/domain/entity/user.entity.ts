import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { UserInputModel } from '../../api/model/user.model';
import { hash } from 'bcrypt';

@Entity({ name: 'users' })
export class UserEntity {
  constructor(userParams: UserInputModel) {
    if (userParams) {
      this.email = userParams.email;
      this.login = userParams.login;
      this.bio = userParams.bio || '';
      this.passwordHash = userParams.password;
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  login: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  passwordHash: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  async hashPassword() {
    this.passwordHash = await hash(this.passwordHash, 10);
  }
}
