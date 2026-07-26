import { ROLES, RoleValue } from '@domain/user';

export const POST_MANAGEMENT_POLICY: RoleValue[] = [ROLES.ADMIN, ROLES.TEACHER];

export const USER_MANAGEMENT_POLICY: RoleValue[] = [ROLES.ADMIN];

export const LESSON_PLAN_POLICY: RoleValue[] = [ROLES.ADMIN, ROLES.TEACHER];
