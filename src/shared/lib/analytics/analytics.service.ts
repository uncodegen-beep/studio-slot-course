import { Injectable, signal } from '@angular/core';

export interface AnalyticsEvent {
    readonly name: string;
    readonly params: Readonly<Record<string, unknown>>;
}

/**
 * Учебная аналитика: события копятся в памяти. В реальном проекте track()
 * отправлял бы их на сервер или в Яндекс Метрику — только с согласия пользователя
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
    private readonly log = signal<readonly AnalyticsEvent[]>([]);
    readonly events = this.log.asReadonly();

    track(name: string, params: Record<string, unknown> = {}): void {
        this.log.update((events) => [...events, { name, params }]);
    }
}
