import * as promClient from 'prom-client';
import { BusinessMetricsCatalog } from '@application/providers/telemetry';
import {
  TechnicalMetricsCatalog,
  MetricsRegistryPort
} from '@infrastructure/providers/telemetry';

export class PrometheusMetricsRegistry implements MetricsRegistryPort {
  private readonly registry: promClient.Registry;
  private readonly counters = new Map<string, promClient.Counter<string>>();
  private readonly histograms = new Map<string, promClient.Histogram<string>>();

  constructor() {
    this.registry = new promClient.Registry();

    promClient.collectDefaultMetrics({ register: this.registry });

    this.initilizeConters();
    this.initializeHistograms();
  }

  private initilizeConters(): void {
    const userRegisteredCounter = new promClient.Counter({
      name: BusinessMetricsCatalog.USER_REGISTERED,
      help: 'Total number of user registrations',
      labelNames: ['role', 'success'],
      registers: [this.registry]
    });

    this.counters.set(
      BusinessMetricsCatalog.USER_REGISTERED,
      userRegisteredCounter
    );

    const userLoginCounter = new promClient.Counter({
      name: BusinessMetricsCatalog.USER_LOGIN,
      help: 'Total number of user logged',
      labelNames: ['success'],
      registers: [this.registry]
    });

    this.counters.set(BusinessMetricsCatalog.USER_LOGIN, userLoginCounter);

    const postCreatedCounter = new promClient.Counter({
      name: BusinessMetricsCatalog.POST_CREATED,
      help: 'Total number of post created',
      labelNames: ['author'],
      registers: [this.registry]
    });

    this.counters.set(BusinessMetricsCatalog.POST_CREATED, postCreatedCounter);

    const postDeletedCounter = new promClient.Counter({
      name: BusinessMetricsCatalog.POST_DELETED,
      help: 'Total number of post deleted',
      labelNames: ['author'],
      registers: [this.registry]
    });

    this.counters.set(BusinessMetricsCatalog.POST_DELETED, postDeletedCounter);

    const httpRequestsCounter = new promClient.Counter({
      name: TechnicalMetricsCatalog.HTTP_REQUESTS_TOTAL,
      help: 'Total number of HTTP requests processed',
      labelNames: ['method', 'route', 'statusCode'],
      registers: [this.registry]
    });

    this.counters.set(
      TechnicalMetricsCatalog.HTTP_REQUESTS_TOTAL,
      httpRequestsCounter
    );
  }

  private initializeHistograms(): void {
    const httpRequestDuration = new promClient.Histogram({
      name: TechnicalMetricsCatalog.HTTP_REQUEST_DURATION,
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'statusCode'],
      buckets: [0.1, 0.3, 0.5, 1, 2, 5],
      registers: [this.registry]
    });

    this.histograms.set(
      TechnicalMetricsCatalog.HTTP_REQUEST_DURATION,
      httpRequestDuration
    );

    const dbQueryDuration = new promClient.Histogram({
      name: TechnicalMetricsCatalog.DB_QUERY_DURATION,
      help: 'Duration of DB query duration in seconds',
      labelNames: ['operation', 'collection'],
      buckets: [0.1, 0.3, 0.5, 1, 2, 5],
      registers: [this.registry]
    });

    this.histograms.set(
      TechnicalMetricsCatalog.DB_QUERY_DURATION,
      dbQueryDuration
    );
  }

  public async getMetricsString(): Promise<string> {
    return this.registry.metrics();
  }

  public getContentType(): string {
    return this.registry.contentType;
  }

  public getCounters(): Map<string, promClient.Counter<string>> {
    return this.counters;
  }

  public getHistograms(): Map<string, promClient.Histogram<string>> {
    return this.histograms;
  }
}
