import { TelemetryPort } from '@application/providers/telemetry';
import {
  PrometheusTelemetry,
  PrometheusMetricsRegistry,
  TechnicalTelemetryPort
} from '@infrastructure/providers/telemetry';

type TelemetryPortProvider = TelemetryPort & TechnicalTelemetryPort;

export function makePrometheusTelemetry(): TelemetryPortProvider {
  const prometheusMetricsRegistry = new PrometheusMetricsRegistry();
  return new PrometheusTelemetry(prometheusMetricsRegistry);
}
