import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionsService } from './application/sessions.service';
import { SessionsEntity } from './domain/entity/session.entity';
import { SessionsRepository } from './infrastructure/sessions.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SessionsEntity])],
  providers: [SessionsService, SessionsRepository],
  exports: [SessionsService],
})
export class SessionsModule {}
