import type { Role } from './Role';
export class User {
    phone: string;
    name: string;
    password: string;
    roles: Role[];
    unit: string;
    constructor(phone: string, name: string, password: string, roles: Role[], unit: string = '') {
        this.phone = phone;
        this.name = name;
        this.password = password;
        this.roles = roles;
        this.unit = unit;
    }
}
