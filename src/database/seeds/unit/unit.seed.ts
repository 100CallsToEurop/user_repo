import * as uuid from 'uuid';
import { hash } from 'bcrypt';
import { OPTIMUM } from '@app/modules/groups/template_packages/optimum.package';

export const group_unit = async (name: string) => {
  return { id: uuid.v4(), nameGroup: name };
};

export const package_unut = OPTIMUM;

export const user_unit = async (num: number, organization: string) => {
  return {
    id: uuid.v4(),
    email: `user${num}@test.ru`,
    password: await hash('Sven174234!234', 10),
    firstName: `user${num} first name`,
    lastName: `user${num} last name`,
    patronymicName: `user${num} patronymic name`,
    organization,
    position: `user${num} position`,
    division: `user${num} division`,
    phone: `2-555-555`,
  };
};
