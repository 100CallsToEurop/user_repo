import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'sessions'})
export class SessionsEntity{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string

}