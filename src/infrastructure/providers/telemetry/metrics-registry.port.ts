import type { Counter, Histogram } from 'prom-client';

export interface MetricsRegistryPort {
  getCounters(): Map<string, Counter<string>>;
  getHistograms(): Map<string, Histogram<string>>;
  getMetricsString(): Promise<string>;
  getContentType(): string;
}
