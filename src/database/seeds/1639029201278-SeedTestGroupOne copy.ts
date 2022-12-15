
import { MigrationInterface, QueryRunner } from 'typeorm';
import { group_unit, package_unut, user_unit } from './unit/unit.seed';

export class SeedTestGroupOne1639029201278 implements MigrationInterface {
  name = 'SeedTestGroupOne1639029201278';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const group = await group_unit('ООО "Тестовая группа-1"');
    const package_group = package_unut;
    const user_admin = await user_unit(1, group.nameGroup);
    const user_writer = await user_unit(2, group.nameGroup);
    const user_reader = await user_unit(3, group.nameGroup);
    const users = [user_admin, user_writer, user_reader];

    const params = JSON.stringify({
      small: {
        title: 'Маленький',
        width: 27,
        height: 10,
        font: 8,
      },
      medium: {
        title: 'Средний',
        width: 43,
        height: 19,
        font: 10,
      },
      large: {
        title: 'Большой',
        width: 65,
        height: 35,
        font: 12,
      },
    });

    await queryRunner.query(
      `INSERT INTO groups(id, "nameGroup", "namePackage", "backupFrequency", "maxSaveBackup", "maxCountAccount", "expiresDataAccount", "maxRoleAccount", "isAdminAccont", "maxCountRowTable", "maxCountCustumTemplateTable", "isPrintLabel", "isChooseExpiredValue", "isNotification", "isMultipleFilter", "isHideShowColumns", "isMoveColumns", "isFreezeColumns", "isUplodingCSV", "isUplodingXLSX", "isCreateVerificationSchedule", "isChoiceMounth", "isStoreCertificates", "isRowPinning", "maxSizeOfSpacePerPosition", "IsFavoriteIdsEnabled")
	VALUES ('${group.id}', '${group.nameGroup}', '${package_group.name}', '${package_group.backupFrequency}', '${package_group.maxSaveBackup}', '${package_group.maxCountAccount}', '2022-12-12', '${package_group.maxRoleAccount}', '${package_group.isAdminAccont}', '${package_group.maxCountRowTable}', '${package_group.maxCountCustumTemplateTable}', '${package_group.isPrintLabel}', '${package_group.isChooseExpiredValue}', '${package_group.isNotification}', '${package_group.isMultipleFilter}', '${package_group.isHideShowColumns}', '${package_group.isMoveColumns}', '${package_group.isFreezeColumns}', '${package_group.isUplodingCSV}', '${package_group.isUplodingXLSX}', '${package_group.isCreateVerificationSchedule}', '${package_group.isChoiceMounth}', '${package_group.isStoreCertificates}', '${package_group.isRowPinning}', '${package_group.maxSizeOfSpacePerPosition}', '${package_group.IsFavoriteIdsEnabled}')`,
    );

    for (let i = 0; i < users.length; i++) {
      await queryRunner.query(
        `INSERT INTO users(
	id, email, "passwordHash", banned, active, "banReason", "groupId", "createAt", updated_at)
	VALUES ('${users[i].id}', '${users[i].email}', '${users[i].password}', 'false', 'true', '', '${group.id}', '2021-04-12', '2021-04-12')
      `,
      );

      await queryRunner.query(
        `INSERT INTO "print-settings"(params, "userId") VALUES ('${params}', '${users[i].id}');`,
      );

      await queryRunner.query(
        `INSERT INTO profiles(
	"userId", "firstName", "lastName", "patronymicName", organization, "position", division, phone)
	VALUES ('${users[i].id}', '${users[i].firstName}', '${users[i].lastName}', '${users[i].patronymicName}', '${users[i].organization}', '${users[i].position}', '${users[i].division}', '${users[i].phone}')`,
      );

      await queryRunner.query(
        `INSERT INTO notifications(
	"userId", "isNotificationEnabled", "dateOfSendingNotification", "rangeOfSelection", "subscribedEmails", start_at, start_notification, end_notification, "end_notificationBad")
	VALUES ('${users[i].id}', 'false', '1', '1', '[]', null, null, null, null)`,
      );

      for (let j = 5; j > i + 2; j--) {
        await queryRunner.query(
          `INSERT INTO users_roles_roles ("usersId", "rolesId") 
        VALUES ('${users[i].id}', ${j})`,
        );
      }
    }
  }

  public async down(): Promise<void> {}
}
