import { UserError } from '@shared/errors/user/user-error';

export const ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student'
} as const;

export type RoleValue = (typeof ROLES)[keyof typeof ROLES];

export class Role {
  private readonly value: RoleValue;

  private constructor(value: RoleValue) {
    this.value = value;
  }

  static default(): Role {
    return new Role(ROLES.STUDENT);
  }

  static create(value: RoleValue | string): Role {
    const normalized = value.toLowerCase().trim();

    if (this.isValid(normalized)) {
      return new Role(normalized);
    }

    throw UserError.invalidRole();
  }

  private static isValid(value: string): value is RoleValue {
    return Object.values(ROLES).includes(value as RoleValue);
  }

  getValue(): RoleValue {
    return this.value;
  }

  equals(other: Role): boolean {
    return this.value === other.value;
  }
}
