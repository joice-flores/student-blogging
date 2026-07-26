import {
  TechnicalMetricName,
  TechnicalMetricLabels
} from '@infrastructure/providers/telemetry';

export interface TechnicalTelemetryPort {
  observeDuration<T extends TechnicalMetricName>(
    name: T,
    seconds: number,
    labels?: TechnicalMetricLabels[T]
  ): void;
  recordHttpRequest(params: {
    method: string;
    route: string;
    statusCode: string;
    durationSeconds: number;
  }): void;
  getMetricsRegistryContentType(): string;
  getMetricsRegistryString(): Promise<string>;
}
