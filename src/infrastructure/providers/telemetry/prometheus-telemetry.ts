import {
  TelemetryPort,
  BusinessMetricName,
  BusinessMetricLabels
} from '@application/providers/telemetry';
import {
  TechnicalMetricName,
  TechnicalMetricLabels,
  TechnicalMetricsCatalog
} from '@infrastructure/providers/telemetry';
import {
  MetricsRegistryPort,
  TechnicalTelemetryPort
} from '@infrastructure/providers/telemetry';

type AllMetricNames = BusinessMetricName | TechnicalMetricName;
type AllMetricLabels = BusinessMetricLabels & TechnicalMetricLabels;

export class PrometheusTelemetry
  implements TelemetryPort, TechnicalTelemetryPort
{
  constructor(private readonly metricsRegistry: MetricsRegistryPort) {}

  incrementCounter<T extends AllMetricNames>(
    name: T,
    labels?: AllMetricLabels[T]
  ): void {
    const counter = this.metricsRegistry.getCounters().get(name);

    if (counter) {
      counter.inc(labels as Record<string, string | number>);
      return;
    }

    console.warn(
      `[Telemetry Adapter] Metric type counter not configured on registry: ${name}`
    );
  }

  observeDuration<T extends AllMetricNames>(
    name: T,
    seconds: number,
    labels?: AllMetricLabels[T]
  ): void {
    const histogram = this.metricsRegistry.getHistograms().get(name);

    if (histogram) {
      histogram.observe(labels as Record<string, string | number>, seconds);
      return;
    }

    console.warn(
      `[Telemetry Adapter] Metric type histogram not configured on registry: ${name}`
    );
  }

  recordHttpRequest(params: {
    method: string;
    route: string;
    statusCode: string;
    durationSeconds: number;
  }): void {
    const labels = {
      method: params.method,
      route: params.route,
      statusCode: params.statusCode
    };

    this.incrementCounter(
      TechnicalMetricsCatalog.HTTP_REQUESTS_TOTAL as TechnicalMetricName,
      labels
    );
    this.observeDuration(
      TechnicalMetricsCatalog.HTTP_REQUEST_DURATION as TechnicalMetricName,
      params.durationSeconds,
      labels
    );
  }

  getMetricsRegistryContentType(): string {
    return this.metricsRegistry.getContentType();
  }

  getMetricsRegistryString(): Promise<string> {
    return this.metricsRegistry.getMetricsString();
  }
}
