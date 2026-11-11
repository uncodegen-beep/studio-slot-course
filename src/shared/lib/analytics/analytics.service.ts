import { Injectable, inject, signal } from '@angular/core';

import { ANALYTICS_SINKS } from './analytics-sink';

export interface AnalyticsEvent {
    readonly name: string;
    readonly params: Readonly<Record<string, unknown>>;
}

/**
 * Учебная аналитика: события копятся в памяти и уходят всем получателям из ANALYTICS_SINKS.
 * В реальном проекте получатель отправлял бы их в Метрику — только с согласия пользователя
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
    /** Получателей может не быть вовсе: optional вернёт null вместо ошибки (подробно — урок 40) */
    private readonly sinks = inject(ANALYTICS_SINKS, { optional: true }) ?? [];

    private readonly log = signal<readonly AnalyticsEvent[]>([]);
    readonly events = this.log.asReadonly();

    track(name: string, params: Record<string, unknown> = {}): void {
        const event: AnalyticsEvent = { name, params };
        this.log.update((events) => [...events, event]);
        this.sinks.forEach((sink) => sink.send(event));
    }
}
