import { UserEntity } from 'src/modules/users/domain/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProfileInputModel } from '../../api/models/profile.mode';

@Entity({ name: 'profiles' })
export class Profile {
  constructor(profile?: ProfileInputModel) {
    if (profile) {
      this.name = profile.name;
      this.lastName = profile.lastName;
    }
  }

  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @OneToOne(() => UserEntity, (user) => user.profile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity;
}
