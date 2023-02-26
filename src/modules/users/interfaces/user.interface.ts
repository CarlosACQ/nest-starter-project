import { Role } from 'src/modules/roles/entities/role.entity';
import { UserStatus } from '../enums';

export interface IUser {
  email: string;
  password: string;
  name: string;
  firstLastname: string;
  secondLastname?: string;
  phone?: string;
  birthdate?: Date;
  status: UserStatus;
  roles: Role[];
  fullname: string;
}