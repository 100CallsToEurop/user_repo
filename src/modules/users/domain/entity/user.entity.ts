import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  OneToOne,
} from 'typeorm';
import { UserInputModel } from '../../api/model/user.model';
import { hash } from 'bcrypt';
import { Profile } from '../../../../modules/profiles/domain/entity/profile.entity';

@Entity({ name: 'users' })
export class UserEntity {
  constructor(userParams: UserInputModel) {
    if (userParams) {
      this.email = userParams.email;
      this.login = userParams.login;
      this.bio = userParams.bio || '';
      this.passwordHash = userParams.password;
      this.profile = new Profile({name: 'Vitaliy', lastName: 'Petrovich'})
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

  @Column({ nullable: true, default: null })
  storageRefreshToken: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
  })
  profile: Profile;

  @BeforeInsert()
  async hashPassword() {
    this.passwordHash = await hash(this.passwordHash, 10);
  }
}
