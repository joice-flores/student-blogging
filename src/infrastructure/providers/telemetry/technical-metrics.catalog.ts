const METRIC_PREFIX = 'student_blogging';

export const TechnicalMetricsCatalog = {
  HTTP_REQUESTS_TOTAL: `${METRIC_PREFIX}_http_requests_total`,
  HTTP_REQUEST_DURATION: `${METRIC_PREFIX}_http_request_duration_seconds`,
  DB_QUERY_DURATION: `${METRIC_PREFIX}_db_query_duration_seconds`,
  PROCESS_MEMORY_USAGE: `${METRIC_PREFIX}_process_memory_usage_bytes`
} as const;

export type TechnicalMetricName =
  (typeof TechnicalMetricsCatalog)[keyof typeof TechnicalMetricsCatalog];

export type TechnicalMetricLabels = {
  [TechnicalMetricsCatalog.HTTP_REQUESTS_TOTAL]: {
    method: string;
    route: string;
    statusCode: string;
  };
  [TechnicalMetricsCatalog.HTTP_REQUEST_DURATION]: {
    method: string;
    route: string;
    statusCode: string;
  };
  [TechnicalMetricsCatalog.DB_QUERY_DURATION]: {
    operation: string;
    collection: string;
  };
  [TechnicalMetricsCatalog.PROCESS_MEMORY_USAGE]: never;
};
