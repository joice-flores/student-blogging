const METRIC_PREFIX = 'student_blogging';

export const BusinessMetricsCatalog = {
  USER_REGISTERED: `${METRIC_PREFIX}_user_registered_total`,
  USER_LOGIN: `${METRIC_PREFIX}_user_login_total`,
  POST_CREATED: `${METRIC_PREFIX}_post_created_total`,
  POST_DELETED: `${METRIC_PREFIX}_post_deleted_total`
} as const;

export type BusinessMetricName =
  (typeof BusinessMetricsCatalog)[keyof typeof BusinessMetricsCatalog];

export type BusinessMetricLabels = {
  [BusinessMetricsCatalog.USER_REGISTERED]: { role?: string; success?: string };
  [BusinessMetricsCatalog.USER_LOGIN]: { success: string };
  [BusinessMetricsCatalog.POST_CREATED]: { author?: string };
  [BusinessMetricsCatalog.POST_DELETED]: { reason?: string };
};
