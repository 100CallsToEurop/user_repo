import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedRoles1639029201277 implements MigrationInterface {
  name = 'SeedRoles1639029201277';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO roles (value, description) 
      VALUES 
      ('SUPER_ADMIN', 'Супер администратор'), 
      ('MANAGER', 'Менеджер'),
      ('ADMIN', 'Администратор'),
      ('USER_WRITER', 'Писатель'),
      ('USER_READER', 'Читатель')
      `,
    );
  }

  public async down(): Promise<void> {}
}
