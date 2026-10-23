import { Role } from './Role';

export class User {
  phone: string;
  name: string;
  password: string;
  roles: Role[];
  unit: string;
  avatarUrl: string;

  constructor(phone: string, name: string, password: string, roles: Role[], unit: string = '', avatarUrl: string = '') {
    this.phone = phone;
    this.name = name;
    this.password = password;
    this.roles = roles;
    this.unit = unit;
    this.avatarUrl = avatarUrl;
  }
}
