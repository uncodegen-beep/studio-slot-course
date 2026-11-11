import { InjectionToken } from '@angular/core';

import type { AnalyticsEvent } from './analytics.service';

/** Куда отправлять события: консоль, Яндекс Метрика, свой сервер */
export interface AnalyticsSink {
    send(event: AnalyticsEvent): void;
}

/**
 * multi-токен: каждый провайдер с multi: true добавляет своего получателя в массив.
 * inject(ANALYTICS_SINKS) → [ConsoleAnalyticsSink, …]
 */
export const ANALYTICS_SINKS = new InjectionToken<readonly AnalyticsSink[]>('ANALYTICS_SINKS');
