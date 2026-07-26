import { RoleValue, ROLES } from '@domain/user';
import { LessonPlanError } from '@shared/errors/lesson-plan/lesson-plan-error';

export function ensureLessonPlanAccess(params: {
  readonly requesterRole: RoleValue;
  readonly isOwner: boolean;
}): void {
  if (params.requesterRole === ROLES.ADMIN) {
    return;
  }

  if (params.isOwner) {
    return;
  }

  throw LessonPlanError.forbidden();
}
