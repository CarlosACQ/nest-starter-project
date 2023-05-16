import { IPermission } from 'src/modules/permissions/interfaces/permission.interface';
import { IUser } from 'src/modules/users/interfaces/user.interface';

export interface IRole {
  name: string;
  description: string;
  isActive: boolean;
  users: IUser[];
  permissions: IPermission[];
}