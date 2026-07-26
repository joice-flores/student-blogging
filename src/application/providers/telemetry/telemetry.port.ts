import {
  BusinessMetricName,
  BusinessMetricLabels
} from '@application/providers/telemetry';

export interface TelemetryPort {
  incrementCounter<T extends BusinessMetricName>(
    name: T,
    labels?: BusinessMetricLabels[T]
  ): void;
}
