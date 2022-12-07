import { UserInputModel } from 'src/modules/users/api/model/user.model';

export const user_unit = (createParam: UserInputModel) => {
  return {
    email: createParam.email,
    login: createParam.login,
    bio: createParam.bio ? createParam.bio : '',
    password: createParam.password,
  };
};
