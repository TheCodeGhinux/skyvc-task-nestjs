import UserInterface from '@user/interfaces/UserInterface';

type CreateNewUserOptions = Pick<UserInterface, 'email' | 'username' | 'password'> & {
  admin_secret?: string;
};
export default CreateNewUserOptions;
